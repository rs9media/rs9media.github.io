(function($) {
    // renderUploadForm plugin
    $.fn.renderUploadForm = function(applicationName, foreignRecordId) {
        var targetElement = $(this);
        $.ajax({
            "type": "POST",
            "data": {
                "applicationName": applicationName,
                "foreignRecordId": foreignRecordId,
            },
            "url": "http://api.asgardia.io/index.php/vault?key=b1e2b9023e5836857ff716271fbdc660&artifactName=renderUploadForm@Library",
            "success": function(data) {
                $(targetElement).html(data.response);
            }
        });
    }
    // viewDirectory plugin
    $.fn.viewDirectory = function(applicationName, foreignRecordId) {
        var targetElement = $(this).css({
            "max-height": "480px",
            "overflow-y": "auto"
        });
        //Make the AJAX Call
        $.ajax({
            "type": "POST",
            "url": "http://api.asgardia.io/index.php/vault?key=b1e2b9023e5836857ff716271fbdc660&artifactName=viewDirectory@Library",
            "data": {
                "applicationName": applicationName,
                "foreignRecordId": foreignRecordId
            },
            "success": function(data) {
                $(targetElement).html(data.response);
            }
        });
    }
    // downloadFile plugin
    $.fn.downloadFile = function(applicationName, foreignRecordId, name) {
        var url = "http://api.asgardia.io/index.php/vault?key=b1e2b9023e5836857ff716271fbdc660&artifactName=downloadFile@Library&applicationName=" + applicationName + "&foreignRecordId=" + foreignRecordId + "&name=" + name;
        window.location = url;
    }

    // Delete
    $.fn.deleteFile = function(applicationName, foreignRecordId, name) {
        var targetElement = $(this).unbind().click(function() {
            if (confirm("Are you sure?")) {
                $.ajax({
                    method: "POST",
                    url: "http://api.asgardia.io/index.php/vault?key=b1e2b9023e5836857ff716271fbdc660&artifactName=deleteFile@Library",
                    "data": {
                        "applicationName": applicationName,
                        "foreignRecordId": foreignRecordId,
                        "name": name,
                    },
                    success: function(data) {
                        if (data.operation == true) {
                            targetElement.parents("tr").remove();
                        }
                        else {
                            alert("An error occurred while deleting your file.");
                        }
                    }
                });
            }
        });
    }
}(jQuery));