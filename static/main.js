 function changeInput(input, tools, elmnt, elmnt_other) {
      // Hide all elements with class="tabcontent" by default */
      var i, tabcontent, tool_box, tablinks;
      tabcontent = document.getElementsByClassName("tabcontent");
      tool_box = document.getElementsByClassName("tool-box");


      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tool_box[i].style.display = "none";
      }
      

      // Show the specific tab content
      document.getElementById(input).style.display = "block";
      document.getElementById(tools).style.display = "block";

      document.getElementById(elmnt).style.borderBottom = "2px solid black";
      document.getElementById(elmnt_other).style.borderBottom = "none";
  }

  // Get the element with id="defaultOpen" and click on it
  document.getElementById("tab_draw").click(); 

    //https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
  var base64;

  function previewFile() {
      const preview = document.querySelector('.img_upload');
      const file = document.querySelector('input[type=file]').files[0];
      const reader = new FileReader();

      reader.addEventListener("load", function () {
          // get base64 image 
          $(".upload-img").css('background-image', 'url("' + reader.result + '")'); 
          //https://stackoverflow.com/questions/47195119/how-to-capture-filereader-base64-as-variable
          $(".img-placeholder").css('display', 'none');        
          base64 = reader.result;
      }, false);

      if (file) {
          reader.readAsDataURL(file);
      }
  }
  

  const popupContainer = document.querySelector('.popup-container')

  function showPopup() {
    popupContainer.style.display = 'block'
  }

  function closePopup() {
    popupContainer.style.display = 'none'
  }

  // // When the user clicks anywhere outside of the modal, close it
  // window.onclick = function(event) {
  //   if (event.target != popupContainer) {
  //     popupContainer.style.display == "none";
  //   }
  // }


  