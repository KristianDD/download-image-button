document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	var that = this,
	App = new downloadApp(),
	fileName = "sample.png",
	uri = encodeURI("http://www.icenium.com/assets/img/icenium-logo.png"),
    folderName = "test";
    
	navigator.splashscreen.hide();
	App.run(uri, fileName, folderName);
}

var downloadApp = function() {
}

downloadApp.prototype = {
	run: function(uri, fileName, folderName) {
		var that = this,
		filePath = "";
        
		document.getElementById("download").addEventListener("click", function() {
			that.getFilesystem(
				function(fileSystem) {
					console.log("gotFS");
                    
					if (device.platform === "Android") {
						that.getFolder(fileSystem, folderName, function(folder) {
							filePath = folder.fullPath + "\/" + fileName;
							that.transferFile(uri, filePath)
						}, function() {
							console.log("failed to get folder");
						});
					}
					else {
						filePath = fileSystem.root.fullPath + "\/" + fileName;
						that.transferFile(uri, filePath)
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

	transferFile: function (uri, filePath) {
		var transfer = new FileTransfer();
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
