var $ = require("./lib/jquery.min");
var page = tabris.create("Page", {
  title: "Forms",
  topLevel: true
});

var page = tabris.create("Page", {
  title: "ITee Forms",
  topLevel: true
});
var progressBar = tabris.create("ProgressBar", {
  layoutData: {left: 0, right: 0, top:0},
  maximum: 300,
  visible:false,
  selection: 100
}).appendTo(page);

tabris.create("TextView", {
  id: "firstNameLabel",
  alignment: "left",
  text: "First Name:"
}).appendTo(page);

tabris.create("TextInput", {
  id: "firstNameInput",
  message: "First Name"
}).appendTo(page);

tabris.create("Button", {
  id: "done",
  text: "Submit",
  background: "#8b0000",
  textColor: "white"
}).on("select", function() {
  validate(page.children("#firstNameInput").get("text"));
}).appendTo(page);
setInterval(function() {
  var selection = progressBar.get("selection") + 1;
  progressBar.set("selection", selection > 300 ? 0 : selection);
}, 20);


  var button = tabris.create("Button", {
    layoutData: {left: 10, top: 10, right: 10},
    id:"picturebtn",
    text: "Take a picture"
  }).appendTo(page).on("select", function() {
    navigator.camera.getPicture(onSuccess, onFail, {
      quality: 50,
      targetWidth: 1024,
      targetHeight: 1024,
      destinationType: window.Camera.DestinationType.DATA_URL
    });
    function onSuccess(imageData) {
      $.post( "http://192.168.0.100/apiserver/upload.php", {data: imageData}, function(data) {
        imageView.set("image", {src: data});
    //console.log("Camera FILE: " + JSON.stringify(imageData));
  });
     
    }
    function onFail(message) {
      console.log("Camera failed because: " + message);
    }
  });

  var imageView = tabris.create("ImageView", {
    layoutData: {top: [button, 20], left: 20, right: 20, bottom: 20}
  }).appendTo(page);

function validate(text)
{
  if(text=='')
  {
   // navigator.notification.alert('Provide your first name!');
    window.plugins.toast.showShortCenter('Provide your first name!');
  }
  else
  {
    var url='http://192.168.0.100/apiserver/processform.php';
    progressBar.set('visible',true);
     $.ajax({
                type:'POST',
                url: url,
                dataType: 'text',
                data:{first_name:text},
                cache:false,
                //timeout: 5000,
                success:  function (data) {
                  navigator.notification.alert(data);
                  page.children("#firstNameInput").set("text","");
                  progressBar.set('visible',false);
                },error: function(data, errorThrown)
                {
                  progressBar.set('visible',false);
                    console.log('Update not fetched'+errorThrown);
                 }
              });
  }
}

page.apply({
  "#firstNameLabel": {layoutData: {left: 10, top: 18, width: 120}},
   "#firstNameInput": {layoutData: {left: ["#firstNameLabel", 10], right: 10, baseline: "#firstNameLabel"}},
   "#done": {layoutData: {left: ["#firstNameLabel", 10], right: 10, top: ["#firstNameInput", 18]}},
    "#picturebtn": {layoutData: {left: ["#firstNameLabel", 10], right: 10, top: ["#done", 18]}}
});

page.open();
