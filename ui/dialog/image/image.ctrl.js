angular.module('kityminderEditor')
    .controller('image.ctrl', ['$http', '$scope', '$modalInstance', 'image', '$filter', function($http, $scope, $modalInstance, image, $filter) {
        $scope.lang = $filter('lang');

        $scope.data = {
            list: [],
            url: image.url || '',
            title: image.title || '',
            R_URL: /^(http|https|data)?\:/
        };

        setTimeout(function() {
            var $imageUrl = $('#image-url');
            $imageUrl.focus();
            $imageUrl[0].setSelectionRange(0, $scope.data.url.length);

            // add event listener
            document.getElementById('paste-image').addEventListener('paste', function(e) {

                var cbd = e.clipboardData;
                var ua = window.navigator.userAgent;

                if ( !(e.clipboardData && e.clipboardData.items) ) return;
                if(cbd.items && cbd.items.length === 2 && cbd.items[0].kind === "string" && cbd.items[1].kind === "file" &&
                    cbd.types && cbd.types.length === 2 && cbd.types[0] === "text/plain" && cbd.types[1] === "Files" &&
                    ua.match(/Macintosh/i) && Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49) return;

                for(var i = 0; i < cbd.items.length; i++) {
                    var item = cbd.items[i];
                    if(item.kind == "file"){
                        var blob = item.getAsFile();
                        if (blob.size === 0) {
                            return;
                        }
                        
                        var fr = new FileReader();
                        fr.onload = function (e) {
                            $scope.data.url = e.target.result ; 
                            $scope.$apply();
                        }
                        fr.readAsDataURL(blob);                          
                    }
                }
            });

        }, 300);

        $modalInstance.rendered.then(function () {
            $('#upload-image').change(function(){
                $scope.uploadImage();
            });
        });


        // 搜索图片按钮点击事件
        $scope.searchImage = function() {
            $scope.list = [];

            getImageData()
                .success(function(json) {
                    if(json && json.data) {
                        for(var i = 0; i < json.data.length; i++) {
                            if(json.data[i].objURL) {
                                $scope.list.push({
                                    title: json.data[i].fromPageTitleEnc,
                                    src: json.data[i].middleURL,
                                    url: json.data[i].middleURL
                                });
                            }
                        }
                    }
                })
                .error(function() {

                });
        };

        // 选择图片的鼠标点击事件
        $scope.selectImage = function($event) {
            var targetItem = $('#img-item'+ (this.$index));
            var targetImg = $('#img-'+ (this.$index));

            targetItem.siblings('.selected').removeClass('selected');
            targetItem.addClass('selected');

            $scope.data.url = targetImg.attr('src');
            $scope.data.title = targetImg.attr('alt');
        };

        // 自动上传图片，后端需要直接返回图片 URL
        $scope.uploadImage = function() {
            var fileInput = $('#upload-image');
            if (!fileInput.val()) {
                return;
            }
            if (/^.*\.(jpg|JPG|jpeg|JPEG|gif|GIF|png|PNG)$/.test(fileInput.val())) {
                var file = fileInput[0].files[0];
                var reader=new FileReader();
                reader.onload = function() {
                    $scope.data.url = this.result;
                    $scope.$apply();
                };
                reader.readAsDataURL(file);
            } else {
                alert(lang('formatinfo', 'ui/dialog/image'));
            }
        };

        $scope.shortCut = function(e) {
            e.stopPropagation();

            if (e.keyCode == 13) {
                $scope.ok();
            } else if (e.keyCode == 27) {
                $scope.cancel();
            }
        };

        $scope.ok = function () {
            if($scope.data.R_URL.test($scope.data.url)) {
                $modalInstance.close({
                    url: $scope.data.url,
                    title: $scope.data.title
                });
            } else {
                $scope.urlPassed = false;

                var $imageUrl = $('#image-url');
                if ($imageUrl) {
                    $imageUrl.focus();
                    $imageUrl[0].setSelectionRange(0, $scope.data.url.length);
                }

            }

            editor.receiver.selectAll();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
            editor.receiver.selectAll();
        };

        function getImageData() {
            var key = $scope.data.searchKeyword2;
            var currentTime = new Date();
            var url = 'http://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&fp=result&queryWord='+ key +'&cl=2&lm=-1&ie=utf-8&oe=utf-8&st=-1&ic=0&word='+ key +'&face=0&istype=2&nc=1&pn=60&rn=60&gsm=3c&'+ currentTime.getTime() +'=&callback=JSON_CALLBACK';

            return $http.jsonp(url);
        }
    }]);
