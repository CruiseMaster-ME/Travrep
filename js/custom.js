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
    $scope.publicKey = "6Lc50dsqAAAAAM1CcBiM2x2ogjdMNroGgX3pryPd";
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

    // $scope.PostSubscribe = function() {
    //     //console.log($scope.Sub);
    //     webService.SendSubscribe($scope.Sub).then(function (response) {
    //         $('#subscribeModal').modal('show');
    //     },
    //     function (response) {
    //         console.log(JSON.stringify(response));
    //     });
    // };

    $scope.PostSubscribe = function() {
        if (!$scope.Sub || !$scope.Sub.Name || !$scope.Sub.Email) {
            alert("Please enter both Name and Email.");
            return;
        }
    
        emailjs.init("-_GUT_0LLY9yh509r"); // Initialize EmailJS with your public key
    
        var templateParams = {
            from_name: $scope.Sub.Name,
            email: $scope.Sub.Email
        };
    
        emailjs.send("service_vztombg", "template_h9q4s7f", templateParams)
        .then(function(response) {
            console.log("Email sent successfully!", response);
            $('#subscribeModal').modal('show'); // Show success modal
        }, function(error) {
            console.log("Email failed to send:", error);
        });
    };

    $scope.PostContact = function() {
        if (vcRecaptchaService.getResponse() === "") { // Check if CAPTCHA is resolved
            console.log("Please resolve the captcha and submit!");
            $scope.CaptchaValidationMsg = "Please resolve the captcha and submit!";
        } else {
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
            
            // Validate input fields
            if ($scope.Contact.FirstName && $scope.Contact.LastName && $scope.Contact.Email) {
                emailjs.init("-_GUT_0LLY9yh509r"); // Initialize EmailJS with your public key
    
                var templateParams = {
                    first_name: $scope.Contact.FirstName,
                    last_name: $scope.Contact.LastName,
                    designation: $scope.Contact.Designation,
                    company: $scope.Contact.Company,
                    country: $scope.Contact.Country.name,
                    city: $scope.Contact.City,
                    phone_code: $scope.Contact.Country.code,
                    phone: $scope.Contact.Phone,
                    email: $scope.Contact.Email,
                    message: $scope.Contact.Message
                };
    
                // Send the email
                emailjs.send("service_vztombg", "template_a433ezz", templateParams)
                .then(function(response) {
                    console.log("Email sent successfully!", response);
                    $('#contactModal').modal('show'); // Show success modal
                }, function(error) {
                    console.log("Email failed to send:", error);
                });
            }
        }
    };
    


    // $scope.PostContact = function() {
    //     if(vcRecaptchaService.getResponse() === ""){ //if string is empty
    //         console.log("Please resolve the captcha and submit!");
    //         $scope.CaptchaValidationMsg = "Please resolve the captcha and submit!";
    //     }else {
    //         var data = {
    //                     FirstName: $scope.Contact.FirstName, 
    //                     LastName: $scope.Contact.LastName, 
    //                     Designation: $scope.Contact.Designation, 
    //                     Company: $scope.Contact.Company, 
    //                     Country: $scope.Contact.Country.name, 
    //                     City: $scope.Contact.City, 
    //                     PhoneCode: $scope.Contact.Country.code, 
    //                     Phone: $scope.Contact.Phone, 
    //                     Email: $scope.Contact.Email, 
    //                     Message: $scope.Contact.Message
    //                 };

    //         console.log(data);
    //         if ($scope.Contact.FirstName && $scope.Contact.LastName && $scope.Contact.Email) {
    //             webService.SendContact(data).then(function (response) {
    //                 $('#contactModal').modal('show');
    //             },
    //             function (response) {
    //                 console.log(JSON.stringify(response));
    //             });
    //         }
    //     }
    // };
});