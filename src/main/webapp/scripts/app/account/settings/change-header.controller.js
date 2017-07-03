'use strict';

angular.module('soundxtreamappApp')
    .controller('ChangeHeaderController', function ($stateParams,$uibModalInstance,$timeout,$scope,$state, $rootScope, Principal, Auth, Language, $translate, Upload, toaster, user,image) {

        $scope.success = null;
        $scope.error = null;
        $scope.cropped = false;

        $scope.settingsAccount = user;
        console.log($scope.settingsAccount);

        $scope.image = image;

        var reader = new FileReader();
        reader.onload = function (loadEvent) {
            $scope.$apply(function () {
                $scope.image = loadEvent.target.result;
            });
        }
        reader.readAsDataURL(image);

        $scope.savebanner = function(){

            var imageBase64 = $scope.croppedArtwork;
            var blob = dataURItoBlob(imageBase64);
            var file = new File([blob],"ds.jpg");

            uploadUsingUploadArtwork(file);
        }

        $scope.closeModal = function(){
            $uibModalInstance.dismiss('cancel');
        }

        function dataURItoBlob(dataURI) {
            var binary = atob(dataURI.split(',')[1]);
            var array = [];
            for(var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
        }

        function uploadUsingUploadArtwork(file) {
            var pictureName = "profileheader-"+$scope.settingsAccount.login.toLowerCase();
            var ext = file.name.split('.').pop();

            pictureName = pictureName.concat("."+ext);

            console.log(pictureName);

            Upload.upload({
                url: 'api/upload',
                data: {file: file, name: pictureName}
            }).then(function () {
                $scope.settingsAccount.profile_header = "uploads/" + pictureName;
                Auth.updateAccount($scope.settingsAccount).then(function() {
                    $scope.error = null;
                    $scope.success = 'OK';
                    Principal.identity(true).then(function(account) {
                        $scope.settingsAccount = account;
                        $scope.account = account;
                        $rootScope.account = account;
                        toaster.pop('success', "Success", "Account updated");
                    });
                    Language.getCurrent().then(function(current) {
                        if ($scope.settingsAccount.langKey !== current) {
                            $translate.use($scope.settingsAccount.langKey);
                        }
                    });
                    $uibModalInstance.close();
                    $state.transitionTo($state.current, $stateParams, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                }).catch(function() {
                    $scope.success = null;
                    $scope.error = 'ERROR';
                    toaster.pop('error',"Whoops!! Something went wrong","Profile picture not saved");
                });
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        }


        /*$scope.save = function () {
            Auth.updateAccount($scope.settingsAccount).then(function() {
                $scope.error = null;
                $scope.success = 'OK';
                Principal.identity(true).then(function(account) {
                    $scope.settingsAccount = copyAccount(account);
                    $scope.account = account;
                    $rootScope.account = account;
                    toaster.pop('success', "Success", "Account updated");
                });
                Language.getCurrent().then(function(current) {
                    if ($scope.settingsAccount.langKey !== current) {
                        $translate.use($scope.settingsAccount.langKey);
                    }
                });
                $state.go("settings",null,{reload:true});
            }).catch(function() {
                $scope.success = null;
                $scope.error = 'ERROR';
            });
            if($scope.picFile != undefined && $scope.cropped == true){
                var imageBase64 = $scope.croppedArtwork;
                var blob = dataURItoBlob(imageBase64);
                var file = new File([blob],"ds.jpg");

                uploadUsingUploadArtwork(file);
            }
            else if($scope.picFile != undefined && $scope.cropped == false){
                uploadUsingUploadArtwork($scope.picFile);
            }
            else if($scope.picFile == undefined && $scope.cropped == false){

            }
        }

        $scope.$watch('picFile', function(){
            if($scope.picFile!=null){
                $scope.artworkShow($scope.picFile);
            }
        });

        $scope.artworkShow = function (e) {
            $scope.artworkFile = e;
            var reader = new FileReader();
            reader.onload = function (e) {
                var image;
                image = new Image();
                image.src = e.target.result;
                return image.onload = function () {
                    return $('.image_user').attr("src", this.src);
                };
            };
            return reader.readAsDataURL(e);
        }





        $scope.savePicture = function(){
            if($scope.picFile != undefined){
                var imageBase64 = $scope.croppedArtwork;
                var blob = dataURItoBlob(imageBase64);
                var file = new File([blob],"ds.jpg");

                $scope.uploadArt(file);
            }
            else{

            }
        }

        /!**
         * Store the "settings account" in a separate variable, and not in the shared "account" variable.
         *!/
        var copyAccount = function (account) {
            return {
                activated: account.activated,
                nickname: account.nickname,
                email: account.email,
                firstName: account.firstName,
                langKey: account.langKey,
                lastName: account.lastName,
                login: account.login,
                user_image: account.user_image,
                profile_header: account.profile_header,
                description: account.description
            }
        }*/
    });
