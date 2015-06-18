/*
 * Copyright 2014 Workiva, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(karma, System) {

    System.config({ baseURL: 'base' });

    // Prevent immediately starting tests.
    window.__karma__.loaded = function() {
        // Load everything specified in loadFiles
        for (var i = 0; i < karma.config.jspm.resolvedModuleIDs.length; i++) {
            var modulePath = karma.config.jspm.resolvedModuleIDs[i];
            var promise = System['import'](extractModuleName(modulePath))
                ['catch'](function(e){
                    setTimeout(function() {
                        throw e;
                    });
                });
            promises.push(promise);
        }

        // Promise comes from the es6_module_loader
        Promise.all(promises).then(function(){
            karma.start();
        });
    };

    function extractModuleName(fileName){
        return fileName.replace(/\.js$/, "");
    }

    var promises = [];

    if(!System){
        throw new Error("SystemJS was not found. Please make sure you have " +
                        "initialized jspm via installing a dependency with jspm, " +
                        "or by running 'jspm dl-loader'.");
    }

    // Exclude bundle configurations if useBundles option is not specified
    if(!karma.config.jspm.useBundles){
        System.config({
            bundles: []
        });
    }



})(window.__karma__, window.System);
