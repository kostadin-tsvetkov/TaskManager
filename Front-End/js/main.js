var users = [];
var tasks = [];
var locations = [];
var listViewSelected = true;

$(document).ready(function(){
    getAllUsers();
    getAllTasks();
    getAllLocations();
});

$("#createUserButton").click(function(){
    createUser();
});


$("#createTaskButton").click(function(){
    createTask();
});


$("#createLocationButton").click(function(){
    createLocation();
});

$("#listView").click(function(){
    listViewSelected = true;
    displayDataNewView();
});

$("#gridView").click(function(){
    listViewSelected = false;
    displayDataNewView();
});

$("#filterByUser").change(function(){
    getFilters();
});

$("#filterByCountry").change(function(){
    getFilters();
});

function getFilters() {
    var user = $("#filterByUser").children(":selected").attr("value");
    var country = $("#filterByCountry").children(":selected").attr("value");

    if(user == undefined) {
        user = null;
    }

    if(country == undefined) {
        country = null;
    }

    getFilteredTasks(user, country);
}

function getFilteredTasks(user, country) {

    var urlParams = "";
    if(user != null){
        urlParams += "userId=" + user;
        if(country != null) {
            urlParams += "&";
        }
    }
    if(country != null){
        urlParams += "country=" + country;
    }

    $.ajax({
        method:"GET",
        url: "http://localhost:8080/task/filter?" + urlParams,
        dataType: "json"
    }).done(function(response){
        displayTaskInformation(response, true);
    });
}

function displayDataNewView(){
    displayUserInformation(users, true);
    displayTaskInformation(tasks, true);
    displayLocationInformation(locations, true);
}

//USERS

function getAllUsers(){
    $.ajax({
        method:"GET",
        url: "http://localhost:8080/allUsers",
        dataType: "json"
    }).done(function(response){
        if(response.length != 0){
            displayUserInformation(response, false);
        }
        checkForDisplayedUsers();
    }).fail(function(){
        console.log("Something went wrong!");
    }).always(function(){
        console.log("Request sent");
    });
}

function displayUserInformation(data, emptyContainer) {
    if(data.length == 0){
        checkForDisplayedUsers();
        return;
    }

    if(listViewSelected){
        displayUserInformationList(data, "List", emptyContainer);
    } else {
        displayUserInformationList(data, "Grid", emptyContainer);
    }
}

function displayUserInformationList(response, view, emptyContainer){
    if(emptyContainer) {
        $('#usersContainer').html('');
    }
    $.each(response, function(index, value){
        if(!emptyContainer){
            users.push(value);
            $("#usersSelect").append(new Option(value.firstName + " " + value.lastName, value.id));
            $("#filterByUser").append(new Option(value.firstName + " " + value.lastName, value.id));
        }
        var userDisplayElement = $('#userViewClone' + view).clone();
        userDisplayElement.attr('id', value.id);
        userDisplayElement.find('#firstName' + view).text(value.firstName);
        userDisplayElement.find('#lastName' + view).text(value.lastName);
        userDisplayElement.find('#email' + view).text(value.email);
        userDisplayElement.find('#phone' + view).text(value.phone);
        userDisplayElement.find('button').click(function(){
            userDisplayElement.remove();
            $.ajax({
                method:"DELETE",
                url: "http://localhost:8080/user?id=" + userDisplayElement.attr('id'),
                dataType: "json"
            });

            var tempArr = users;
            users = [];
            $.each(tempArr, function(index, value){
                if(value.id != userDisplayElement.attr('id')){
                    users.push(value);
                }
            });

            checkForDisplayedUsers();
        });

        $('#usersContainer').append(userDisplayElement);
        userDisplayElement.show();
    });
}

function createUser() {
    var firstNameInput = $("#firstNameInput").val();
    var lastNameInput = $("#lastNameInput").val();
    var emailInput = $("#emailInput").val();
    var phoneInput = $("#phoneInput").val();

    var user = { "firstName": firstNameInput, "lastName": lastNameInput, "email": emailInput, "phone": phoneInput}
    $.ajax({
        method:"POST",
        url: "http://localhost:8080/user",
        data: JSON.stringify(user),
        dataType: "json",
        contentType: "application/json",
        success: function(response){
            var userList = [response];

            displayUserInformation(userList, false);
            checkForDisplayedUsers();
        }
    });
}

function checkForDisplayedUsers(){
    if(users.length == 0) {
        $("#noUsers").show();
    } else {
        $("#noUsers").hide();
    }
}

//TASKS

function getAllTasks() {
    $.ajax({
            method:"GET",
            url: "http://localhost:8080/allTasks",
            dataType: "json"
        }).done(function(response){
            if(response.length != 0) {
                displayTaskInformation(response, false);
            }
            checkForDisplayedTasks();
        }).fail(function(){
            console.log("Something went wrong!");
        }).always(function(){
            console.log("Request sent");
        });
}

function displayTaskInformation(data, emptyContainer) {
    if(data.length == 0){
        if(emptyContainer) {
            $('#tasksContainer').html('');
        }
        users = [];
        checkForDisplayedTasks();
        return;
    }

    if(listViewSelected){
        displayTaskInformationList(data, "List", emptyContainer);
    } else {
        displayTaskInformationList(data, "Grid", emptyContainer);
    }
}

function displayTaskInformationList(response, view, emptyContainer) {
    if(emptyContainer) {
        $('#tasksContainer').html('');
    }
    $.each(response, function(index, value){
        if(!emptyContainer){
            tasks.push(value);
        }

        var taskDisplayElement = $('#taskViewClone' + view).clone();
        taskDisplayElement.attr('id', value.id);
        taskDisplayElement.find('#title' + view).text(value.title);
        taskDisplayElement.find('#description' + view).text(value.description);
        taskDisplayElement.find('#location' + view).text(value.location.address + ", " + value.location.city);
        taskDisplayElement.find('#user' + view).text(value.user.firstName + " " + value.user.lastName);
        taskDisplayElement.find('button').click(function(){
            taskDisplayElement.remove();
            $.ajax({
                method:"DELETE",
                url: "http://localhost:8080/task?id=" + taskDisplayElement.attr('id'),
                dataType: "json"
            });

            var tempArr = tasks;
            tasks = [];
            $.each(tempArr, function(index, value){
                if(value.id != taskDisplayElement.attr('id')){
                    tasks.push(value);
                }
            });

            checkForDisplayedTasks();
        });

        $('#tasksContainer').append(taskDisplayElement);
        taskDisplayElement.show();
    });
}

function createTask() {
    var titleInput = $("#titleInput").val();
    var descriptionInput = $("#descriptionInput").val();
    var usersSelectedInput = $("#usersSelect option:selected").attr("value");
    var locationsSelectedInput = $("#locationsSelect option:selected").attr("value");

    var task = { "title": titleInput, "description": descriptionInput, "user": {"id": usersSelectedInput}, "location": {"id": locationsSelectedInput}};
    $.ajax({
        method:"POST",
        url: "http://localhost:8080/task",
        data: JSON.stringify(task),
        dataType: "json",
        contentType: "application/json",
        success: function(response){
            var taskList = [response];

            displayTaskInformation(taskList, false);
            checkForDisplayedTasks();
        }
    });
}

function checkForDisplayedTasks(){
    if(tasks.length == 0) {
        $("#noTasks").show();
    } else {
        $("#noTasks").hide();
    }
}

//LOCATIONS

function getAllLocations() {
    $.ajax({
        method:"GET",
        url: "http://localhost:8080/allLocations",
        dataType: "json"
    }).done(function(response){
        if(response.length != 0) {
            displayLocationInformation(response, false);
        }
        checkForDisplayedLocations();
    }).fail(function(){
        console.log("Something went wrong!");
    }).always(function(){
        console.log("Request sent");
    });
}

function displayLocationInformation(data, emptyContainer) {
    if(data.length == 0){
        checkForDisplayedLocations();
        return;
    }

    if(listViewSelected){
        displayLocationInformationList(data, "List", emptyContainer);
    } else {
        displayLocationInformationList(data, "Grid", emptyContainer);
    }
}

function displayLocationInformationList(response, view, emptyContainer) {
    if(emptyContainer) {
        $('#locationsContainer').html('');
    }
    $.each(response, function(index, value){
        if(!emptyContainer){
            locations.push(value);
            $("#locationsSelect").append(new Option(value.city + ", " + value.address + ", " + value.country, value.id));
            $("#filterByCountry").append(new Option(value.country, value.country));
        }


        var locationDisplayElement = $('#locationViewClone' + view).clone();
        locationDisplayElement.attr('id', value.id);
        locationDisplayElement.find('#address' + view).text(value.address);
        locationDisplayElement.find('#city' + view).text(value.city);
        locationDisplayElement.find('#country' + view).text(value.country);
        locationDisplayElement.find('#longitude' + view).text(value.longitude);
        locationDisplayElement.find('#latitude' + view).text(value.latitude);
        locationDisplayElement.find('button').click(function(){
            locationDisplayElement.remove();
            $.ajax({
                method:"DELETE",
                url: "http://localhost:8080/location?id=" + locationDisplayElement.attr('id'),
                dataType: "json"
            });

            var tempArr = locations;
            locations = [];
            $.each(tempArr, function(index, value){
                if(value.id != locationDisplayElement.attr('id')){
                    locations.push(value);
                }
            });

            checkForDisplayedLocations();
        });

        $('#locationsContainer').append(locationDisplayElement);
        locationDisplayElement.show();
    });
}

function createLocation() {
    var addressInput = $("#addressInput").val();
    var cityInput = $("#cityInput").val();
    var countryInput = $("#countryInput").val();
    var longitudeInput = $("#longitudeInput").val();
    var latitudeInput = $("#latitudeInput").val();

    var location = { "address": addressInput, "city": cityInput, "country": countryInput, "longitude": longitudeInput, "latitude": latitudeInput}
    $.ajax({
        method:"POST",
        url: "http://localhost:8080/location",
        data: JSON.stringify(location),
        dataType: "json",
        contentType: "application/json",
        success: function(response){
            var locationList = [response];

            displayLocationInformation(locationList, false);
            checkForDisplayedLocations();
        }
    });
}

function checkForDisplayedLocations(){
    if(locations.length == 0) {
        $("#noLocations").show();
    } else {
        $("#noLocations").hide();
    }
}