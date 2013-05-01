document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    var that = this,
        App = new downloadApp();
    
    navigator.splashscreen.hide();
    App.run();
}

var downloadApp = function() {
}

downloadApp.prototype = {
	run: function() {
		var that = this;
        
		document.getElementById("download").addEventListener("click", function() {
			that.getFilesystem(
				function(fileSystem) {
                    
					console.log("gotFS");
                    
					if (device.platform === "Android") {
						that.getFolder(fileSystem, "test", function(folder) {
							that.transferFile(folder.fullPath)
						}, function() {
							console.log("failed to get folder");
						});
					} else {
                        that.transferFile(fileSystem.root.fullPath)
                    }
				},
				function() {
					console.log("failed to get filesystem");
				}
				);
		});
	},
    
	getFilesystem:function (success, fail) {
		window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, success, fail);
	},

	getFolder: function (fileSystem, folderName, success, fail) {
		fileSystem.root.getDirectory(folderName, {create: true, exclusive: false}, success, fail)
	},

	transferFile: function (fileSystemPath) {
		var transfer = new FileTransfer(),
		uri = encodeURI("http://www.icenium.com/assets/img/icenium-logo.png");
		filePath = fileSystemPath + '/sample.png';
		transfer.download(
			uri,
			filePath,
			function(entry) {
				var image = document.getElementById("downloadedImage");
				image.src = entry.fullPath;
                document.getElementById("result").innerHTML = "File saved to: " + entry.fullPath;
			},
			function(error) {
				console.log("download error source " + error.source);
				console.log("download error target " + error.target);
				console.log("upload error code" + error.code);
			}
			);
	}
}
