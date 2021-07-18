angular.module('kityminderEditor')
    .directive('topTab', function () {
        return {
            restrict: 'A',
            templateUrl: 'ui/directive/topTab/topTab.html',
            scope: {
                minder: '=topTab',
                editor: '='
            },
            link: function (scope) {

                var selectedTab = 'idea';
                scope.selectTopTab = function (tab) {
                    if (selectedTab === tab) {
                        $('.tab-content').animate({
                            height: 0,
                            display: 'none'
                        });
                        $('.minder-editor').animate({
                            top: '32px'
                        });

                        return selectedTab = null;
                    }
                    if (selectedTab === null) {
                        $('.tab-content').animate({
                            height: '60px',
                            display: 'block'
                        });
                        $('.minder-editor').animate({
                            top: '92px'
                        });
                    }

                    selectedTab = tab;
                };
            }
        }
    });