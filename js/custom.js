var app = angular.module('TravRepsApp',['vcRecaptcha']);

app.constant('initValue', {baseURL: 'https://tras.nurac.com/travreps/'});

app.service("webService", function ($q, $http, initValue) {
    this.SendSubscribe = function (data) {
        return $http.post(initValue.baseURL + 'subscribe', data);
    };
    this.SendContact = function (data) {
        return $http.post(initValue.baseURL + 'contact', data);
    };
});

app.controller('ctrlHome', function ($scope, $http, $window, vcRecaptchaService, webService) {
    $scope.publicKey = "6Le-9jQbAAAAAIkNRb55a-pfEj-JcX3x4en-vlEY";
    $scope.Countries = [];
    $scope.Sub = { Name: '', Email: '' };
    $scope.country = { code: '', name: '' };
    $scope.Contact = { FirstName: '', LastName: '', Designation: '', Company: '', Country: null, City: '', Phone: '', Email: '', Message: '' };
    $scope.CaptchaValidationMsg = null;

    $scope.Get = function() {
        $http.get('countries.json')
            .then(function (data) {
                $scope.Countries = data.data.countries;
            },
            function (response) {
                console.log(JSON.stringify(response));
                $scope.employees = {};
            });
    };

    $scope.PostSubscribe = function() {
        //console.log($scope.Sub);
        webService.SendSubscribe($scope.Sub).then(function (response) {
            $('#subscribeModal').modal('show');
        },
        function (response) {
            console.log(JSON.stringify(response));
        });
    };

    $scope.PostContact = function() {
        if(vcRecaptchaService.getResponse() === ""){ //if string is empty
            console.log("Please resolve the captcha and submit!");
            $scope.CaptchaValidationMsg = "Please resolve the captcha and submit!";
        }else {
            var data = {
                        FirstName: $scope.Contact.FirstName, 
                        LastName: $scope.Contact.LastName, 
                        Designation: $scope.Contact.Designation, 
                        Company: $scope.Contact.Company, 
                        Country: $scope.Contact.Country.name, 
                        City: $scope.Contact.City, 
                        PhoneCode: $scope.Contact.Country.code, 
                        Phone: $scope.Contact.Phone, 
                        Email: $scope.Contact.Email, 
                        Message: $scope.Contact.Message
                    };

            console.log(data);
            if ($scope.Contact.FirstName && $scope.Contact.LastName && $scope.Contact.Email) {
                webService.SendContact(data).then(function (response) {
                    $('#contactModal').modal('show');
                },
                function (response) {
                    console.log(JSON.stringify(response));
                });
            }
        }
    };
});