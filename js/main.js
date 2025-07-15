(function ($)
  { "use strict"
  

/* 1. Proloder */
    $(window).on('load', function () {
      $('#preloader-active').delay(450).fadeOut('slow');
      $('body').delay(450).css({
        'overflow': 'visible'
      });
    });

/* 2. sticky And Scroll UP */
    $(window).on('scroll', function () {
      var scroll = $(window).scrollTop();
      if (scroll < 400) {
        $(".header-sticky").removeClass("sticky-bar");
        $('#back-top').fadeOut(500);
      } else {
        $(".header-sticky").addClass("sticky-bar");
        $('#back-top').fadeIn(500);
      }
    });

  // Scroll Up
    $('#back-top a').on("click", function () {
      $('body,html').animate({
        scrollTop: 0
      }, 800);
      return false;
    });
  

/* 3. slick Nav */
// mobile_menu
    var menu = $('ul#navigation');
    if(menu.length){
      menu.slicknav({
        prependTo: ".mobile_menu",
        closedSymbol: '+',
        openedSymbol:'-'
      });
    }



/* 4. MainSlider-1 */
    // h1-hero-active
    function mainSlider() {
      var BasicSlider = $('.slider-active');
      BasicSlider.on('init', function (e, slick) {
        var $firstAnimatingElements = $('.single-slider:first-child').find('[data-animation]');
        doAnimations($firstAnimatingElements);
      });
      BasicSlider.on('beforeChange', function (e, slick, currentSlide, nextSlide) {
        var $animatingElements = $('.single-slider[data-slick-index="' + nextSlide + '"]').find('[data-animation]');
        doAnimations($animatingElements);
      });
      BasicSlider.slick({
        autoplay: false,
        autoplaySpeed: 4000,
        dots: false,
        fade: true,
        arrows: false, 
        prevArrow: '<button type="button" class="slick-prev"><i class="ti-angle-left"></i></button>',
        nextArrow: '<button type="button" class="slick-next"><i class="ti-angle-right"></i></button>',
        responsive: [{
            breakpoint: 1024,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true,
            }
          },
          {
            breakpoint: 991,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              arrows: false
            }
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              arrows: false
            }
          }
        ]
      });

      function doAnimations(elements) {
        var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        elements.each(function () {
          var $this = $(this);
          var $animationDelay = $this.data('delay');
          var $animationType = 'animated ' + $this.data('animation');
          $this.css({
            'animation-delay': $animationDelay,
            '-webkit-animation-delay': $animationDelay
          });
          $this.addClass($animationType).one(animationEndEvents, function () {
            $this.removeClass($animationType);
          });
        });
      }
    }
    mainSlider();



    
/* 4. Testimonial Active*/
  var testimonial = $('.h1-testimonial-active');
  if(testimonial.length){
  testimonial.slick({
      dots: false,
      infinite: true,
      speed: 1000,
      autoplay:true,
      loop:true,
      arrows: true,
      prevArrow: '<button type="button" class="slick-prev"><i class="ti-angle-left"></i></button>',
      nextArrow: '<button type="button" class="slick-next"><i class="ti-angle-right"></i></button>',
      slidesToShow: 1,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: false,
            arrow:false
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows:false
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows:false,
          }
        }
      ]
    });
  }



/* 6. Nice Selectorp  */
  var nice_Select = $('select');
    if(nice_Select.length){
      nice_Select.niceSelect();
    }

 // Brand Active
 $('.brand-active').slick({
  dots: false,
  infinite: true,
  autoplay: true,
  speed: 400,
  arrows: false,
  slidesToShow: 5,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 3,
        infinite: true,
        dots: false,
      }
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    },

    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ]
});

/* 7. data-background */
    $("[data-background]").each(function () {
      $(this).css("background-image", "url(" + $(this).attr("data-background") + ")")
      });


/* 10. WOW active */
    new WOW().init();

// 11. ---- Mailchimp js --------//  
    function mailChimp() {
      $('#mc_embed_signup').find('form').ajaxChimp();
    }
    mailChimp();


// 12 Pop Up Img
    var popUp = $('.single_gallery_part, .img-pop-up');
      if(popUp.length){
        popUp.magnificPopup({
          type: 'image',
          gallery:{
            enabled:true
          }
        });
      }
// 12 Pop Up Video
    var popUp = $('.popup-video');
    if(popUp.length){
      popUp.magnificPopup({
        type: 'iframe'
      });
    }

/* 13. counterUp*/
    $('.counter').counterUp({
      delay: 10,
      time: 3000
    });

/* 14. Datepicker */
  $('#datepicker1').datepicker();

// 15. Time Picker
  $('#timepicker').timepicker();

//16. Overlay
  $(".snake").snakeify({
    speed: 200
  });


//17.  Progress barfiller

  $('#bar1').barfiller();
  $('#bar2').barfiller();
  $('#bar3').barfiller();
  $('#bar4').barfiller();
  $('#bar5').barfiller();
  $('#bar6').barfiller();

})(jQuery);


// upload file code
(function ($)
  { "use strict"
  
/* 1. Proloder */
    $(window).on('load', function () {
      $('#preloader-active').delay(450).fadeOut('slow');
      $('body').delay(450).css({
        'overflow': 'visible'
      });
    });

/* Upload Button Functionality */
$(document).ready(function () {
    const uploadButton = document.getElementById("uploadButton");
    const fileInput = document.getElementById("fileInput");
    const fileList = document.getElementById("fileList");

    if (uploadButton && fileInput) {
        uploadButton.addEventListener("click", function () {
            fileInput.click();
        });

        fileInput.addEventListener("change", function () {
            fileList.innerHTML = "";
            if (fileInput.files.length > 0) {
                const list = document.createElement("ul");
                for (let i = 0; i < fileInput.files.length; i++) {
                    let listItem = document.createElement("li");
                    listItem.textContent = fileInput.files[i].name;
                    list.appendChild(listItem);
                }
                fileList.appendChild(list);
            } else {
                fileList.innerHTML = "<p>No file selected.</p>";
            }
        });
    }
});

/* 2. sticky And Scroll UP */
    $(window).on('scroll', function () {
      var scroll = $(window).scrollTop();
      if (scroll < 400) {
        $(".header-sticky").removeClass("sticky-bar");
        $('#back-top').fadeOut(500);
      } else {
        $(".header-sticky").addClass("sticky-bar");
        $('#back-top').fadeIn(500);
      }
    });

  // Scroll Up
    $('#back-top a').on("click", function () {
      $('body,html').animate({
        scrollTop: 0
      }, 800);
      return false;
    });

})(jQuery);


// reterive data
(function ($)
  { "use strict"

/* 1. Proloder */
    $(window).on('load', function () {
      $('#preloader-active').delay(450).fadeOut('slow');
      $('body').delay(450).css({
        'overflow': 'visible'
      });
    });

/* Upload & Retrieve Button Functionality */
$(document).ready(function () {
    const uploadButton = document.getElementById("uploadButton");
    const fileInput = document.getElementById("fileInput");
    const fileList = document.getElementById("fileList");
    const searchInput = document.getElementById("searchInput");
    const retrieveButton = document.getElementById("retrieveButton");

    if (uploadButton && fileInput) {
        uploadButton.addEventListener("click", function () {
            fileInput.click();
        });

        fileInput.addEventListener("change", function () {
            fileList.innerHTML = "";
            if (fileInput.files.length > 0) {
                const list = document.createElement("ul");
                for (let i = 0; i < fileInput.files.length; i++) {
                    let listItem = document.createElement("li");
                    listItem.textContent = fileInput.files[i].name;
                    list.appendChild(listItem);
                }
                fileList.appendChild(list);
            } else {
                fileList.innerHTML = "<p>No file selected.</p>";
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const searchValue = searchInput.value.toLowerCase();
            const items = fileList.getElementsByTagName("li");
            for (let item of items) {
                if (item.textContent.toLowerCase().includes(searchValue)) {
                    item.style.display = "";
                } else {
                    item.style.display = "none";
                }
            }
        });
    }

    if (retrieveButton) {
        retrieveButton.addEventListener("click", function () {
            const searchValue = searchInput.value.toLowerCase();
            const items = fileList.getElementsByTagName("li");
            let found = false;
            for (let item of items) {
                if (item.textContent.toLowerCase().includes(searchValue)) {
                    alert("Retrieving file: " + item.textContent);
                    found = true;
                    break;
                }
            }
//            if (!found) {
//                alert("No matching file found.");
//            }
        });
    }z
});

/* 2. sticky And Scroll UP */
    $(window).on('scroll', function () {
      var scroll = $(window).scrollTop();
      if (scroll < 400) {
        $(".header-sticky").removeClass("sticky-bar");
        $('#back-top').fadeOut(500);
      } else {
        $(".header-sticky").addClass("sticky-bar");
        $('#back-top').fadeIn(500);
      }
    });

  // Scroll Up
    $('#back-top a').on("click", function () {
      $('body,html').animate({
        scrollTop: 0
      }, 800);
      return false;
    });

})(jQuery);


// request for the data
(function ($)
  { "use strict"
  
/* 1. Proloder */
    $(window).on('load', function () {
      $('#preloader-active').delay(450).fadeOut('slow');
      $('body').delay(450).css({
        'overflow': 'visible'
      });
    });

/* Upload, Retrieve & Request Data Functionality */
$(document).ready(function () {
    const uploadButton = document.getElementById("uploadButton");
    const fileInput = document.getElementById("fileInput");
    const fileList = document.getElementById("fileList");
    const searchInput = document.getElementById("searchInput");
    const retrieveButton = document.getElementById("retrieveButton");
    const requestDataButton = document.getElementById("requestDataButton");

    if (uploadButton && fileInput) {
        uploadButton.addEventListener("click", function () {
            fileInput.click();
        });

        fileInput.addEventListener("change", function () {
            fileList.innerHTML = "";
            if (fileInput.files.length > 0) {
                const list = document.createElement("ul");
                for (let i = 0; i < fileInput.files.length; i++) {
                    let listItem = document.createElement("li");
                    listItem.textContent = fileInput.files[i].name;
                    list.appendChild(listItem);
                }
                fileList.appendChild(list);
            } else {
                fileList.innerHTML = "<p>No file selected.</p>";
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const searchValue = searchInput.value.toLowerCase();
            const items = fileList.getElementsByTagName("li");
            for (let item of items) {
                if (item.textContent.toLowerCase().includes(searchValue)) {
                    item.style.display = "";
                } else {
                    item.style.display = "none";
                }
            }
        });
    }

if (retrieveButton) {
    retrieveButton.addEventListener("click", function () {
        if (!fileList || fileList.children.length === 0) {
            return; // Do nothing if no files available
        }

        const searchValue = searchInput.value.trim().toLowerCase();
        if (!searchValue) {
            alert("Please enter a file name to search.");
            return;
        }

        let found = false;
        const items = fileList.getElementsByTagName("li");
        for (let item of items) {
            if (item.textContent.toLowerCase().includes(searchValue)) {
                // Simulate file download
                const fileName = item.textContent;
                const link = document.createElement("a");
                link.href = `/download/${fileName}`;  // Assuming this endpoint serves the file
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                found = true;
                break;
            }
        }

        if (!found) {
            return; // Do nothing if no match found
        }
    });
}


    if (requestDataButton) {
        requestDataButton.addEventListener("click", function () {
            const searchValue = searchInput.value.toLowerCase();
            if (searchValue.trim() === "") {
                alert("Please enter a file name to request data.");
                return;
            }
            alert("Requesting data from: " + searchValue);
        });
    }
});

/* 2. sticky And Scroll UP */
    $(window).on('scroll', function () {
      var scroll = $(window).scrollTop();
      if (scroll < 400) {
        $(".header-sticky").removeClass("sticky-bar");
        $('#back-top').fadeOut(500);
      } else {
        $(".header-sticky").addClass("sticky-bar");
        $('#back-top').fadeIn(500);
      }
    });

  // Scroll Up
    $('#back-top a').on("click", function () {
      $('body,html').animate({
        scrollTop: 0
      }, 800);
      return false;
    });

})(jQuery);

document.getElementById('fileInput').addEventListener('change', function() {
        var files = this.files;
        var fileList = document.getElementById('fileList');
        fileList.innerHTML = ''; // Clear previous file list

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var fileName = document.createElement('p');
            fileName.textContent = file.name;
            fileList.appendChild(fileName);
        }

        // Automatically submit the form after files are selected
        document.getElementById('submitButton').click();
    });


document.addEventListener("DOMContentLoaded", function() {
    const uploadButton = document.getElementById("uploadButton");
    const userLoggedIn = true; // Replace this with actual login check logic

    if (userLoggedIn) {
        uploadButton.disabled = false;
        uploadButton.classList.remove("disabled");
    }

    uploadButton.addEventListener("click", function() {
        if (userLoggedIn) {
            alert("Uploading files..."); // Replace with actual upload logic
        } else {
            alert("Please log in to upload files.");
        }
    });
});
function requestFile() {
    const filename = document.getElementById("request_filename").value.trim();
    const username = document.getElementById("request_username").value.trim();

    if (!filename || !username) {
        alert("Please enter both filename and username.");
        return;
    }

    fetch("/request-file", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename: filename, username: username }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            loadPendingRequests();
        } else {
            alert("Error: " + (data.error || "Something went wrong"));
        }
    })
    .catch(error => console.error("Fetch error:", error));
}


document.getElementById("retrieveForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    const response = await fetch('/retrieve', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = formData.get("filename");
        document.body.appendChild(a);
        a.click();
        a.remove();
    } else {
        alert("Invalid filename or search key. Please check your email and try again.");
    }
});


document.getElementById("uploadForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let formData = new FormData(this);

    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    alert(result.message || result.error);
});


document.addEventListener("DOMContentLoaded", function () {
    checkUserSessionAndLoadData();
});

function checkUserSessionAndLoadData() {
    fetch("/check-session")
    .then(response => response.json())
    .then(data => {
        if (data.logged_in) {
            console.log(`✅ User logged in: ${data.email}`);
            sessionStorage.setItem("userEmail", data.email);
            loadUserPendingRequests();  // ✅ Ensure requests load immediately
            loadUploadedFiles();  // ✅ Reload uploaded files after login
        } else {
            console.log("❌ User not logged in.");
        }
    })
    .catch(error => console.error("Error checking session:", error));
}

function loadUploadedFiles() {
    fetch("/user-uploaded-files")  // Backend route to get uploaded files
    .then(response => response.json())
    .then(files => {
        let fileList = document.getElementById("uploaded_files");
        fileList.innerHTML = "";

        if (files.error) {
            console.error("❌ Error fetching files:", files.error);
            fileList.innerHTML = `<li>${files.error}</li>`;
            return;
        }

        if (files.length === 0) {
            fileList.innerHTML = "<li>No uploaded files</li>";
            return;
        }

        files.forEach(file => {
            let listItem = document.createElement("li");
            listItem.innerHTML = `<b>${file.filename}</b> - Search Key: ${file.search_key}`;
            fileList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error("❌ Fetch error:", error);
        document.getElementById("uploaded_files").innerHTML = "<li>Error loading files</li>";
    });
}






//// Function to fetch pending requests and update UI
//document.addEventListener("DOMContentLoaded", function() {
//    console.log("🔍 Debug: Fetching pending requests...");
//    loadUserPendingRequests();
//});
//
//function loadUserPendingRequests() {
//    fetch("/user-pending-requests")
//    .then(response => response.json())
//    .then(requests => {
//        console.log("✅ Debug: Requests received from backend:", requests);
//
//        let requestList = document.getElementById("pending_requests");
////        requestList.innerHTML = "";
////
////        if (requests.error) {
////            console.error("❌ Debug: Error fetching requests:", requests.error);
////            requestList.innerHTML = `<li>${requests.error}</li>`;
////            return;
////        }
//        if (!requestList) {
//            console.error("❌ Debug: No element found with ID 'pending_requests'");
//            return;
//        }
//
//        if (requests.length === 0) {
//            console.log("⚠️ Debug: No pending requests found");
//            requestList.innerHTML = "<li>No pending requests</li>";
//            return;
//        }
//        requestList.innerHTML = "";
//
//        requests.forEach(req => {
////            console.log(`📂 Debug: Adding request - ${req.filename} from ${req.username}`);
//            let listItem = document.createElement("li");
//            listItem.innerHTML = `
//                ${req.username} requested <b>${req.filename}</b>
//                <button class="borders-btn" onclick="approveRequest('${req.id}')">Approve</button>
//                <button class="borders-btn" onclick="rejectRequest('${req.id}')">Reject</button>
//            `;
//            requestList.appendChild(listItem);
//        });
//    })
//    .catch(error => {
//        console.error("❌ Debug: Fetch error:", error);
//        document.getElementById("pending_requests").innerHTML = "<li>Error loading requests</li>";
//    });
//}
//
//
//
//function approveRequest(requestId) {
//    fetch("/approve-request", {
//        method: "POST",
//        headers: { "Content-Type": "application/json" },
//        body: JSON.stringify({ id: requestId })
//    })
//    .then(response => response.json())
//    .then(data => {
//        alert(data.message);
//        if (data.link) alert(`Download link: ${data.link}`);
//        loadUserPendingRequests();  // Reload requests after approval
//    })
//    .catch(error => console.error("Error approving request:", error));
//}
//
//function rejectRequest(requestId) {
//    fetch("/reject-request", {
//        method: "POST",
//        headers: { "Content-Type": "application/json" },
//        body: JSON.stringify({ id: requestId })
//    })
//    .then(response => response.json())
//    .then(data => {
//    alert(data.message);
//    loadUserPendingRequests();
//    })
//    .catch(error => console.error("Error rejecting request:", error));
//}
//document.addEventListener("DOMContentLoaded", function () {
//    console.log("✅ JavaScript Loaded");
//
////    const socket = io.connect("http://127.0.0.1:5001");
//    const viewRequestsBtn = document.getElementById("viewRequestsBtn");
//    const pendingRequestsContainer = document.getElementById("pendingRequests");
//
//    if (!viewRequestsBtn) {
//        console.error("❌ View Requests button NOT found in HTML!");
//        return;
//    }
//
//    console.log("✅ View Requests button found!");
//
//    // Ensure button click event is detected
//    viewRequestsBtn.addEventListener("click", function () {
//        console.log("✅ Button Clicked! Fetching requests...");
//        loadPendingRequests();
//    });
//
//    function loadPendingRequests() {
//        console.log("🔄 Fetching pending requests...");
//        fetch("/get_pending_requests")
//            .then(response => {
//                console.log("📡 API Response Received:", response.status);
//                if (!response.ok) throw new Error("❌ Server Error! Check Flask logs.");
//                return response.json();
//            })
//            .then(data => {
//                console.log("✅ Data received:", data);
//                pendingRequestsContainer.innerHTML = ""; // Clear previous content
//
//                if (data.length === 0) {
//                    pendingRequestsContainer.innerHTML = "<p>No pending requests.</p>";
//                    return;
//                }
//
//                data.forEach(request => {
//                    const requestItem = document.createElement("li");
//                    requestItem.innerHTML = `
//                        <strong>${request.sender_email}</strong> requested <strong>${request.file_name}</strong></br>
//                        <button class="approve-btn" data-id="${request._id}">Approve</button>
//                        <button class="reject-btn" data-id="${request._id}">Reject</button>
//                    `;
//                    pendingRequestsContainer.appendChild(requestItem);
//                });
//
//                document.querySelectorAll(".approve-btn").forEach(button => {
//                    button.addEventListener("click", function () {
//                        console.log("✅ Approve Button Clicked for ID:", this.dataset.id);
//                        approveRequest(this.dataset.id);
//                    });
//                });
//
//                document.querySelectorAll(".reject-btn").forEach(button => {
//                    button.addEventListener("click", function () {
//                        console.log("✅ Reject Button Clicked for ID:", this.dataset.id);
//                        rejectRequest(this.dataset.id);
//                    });
//                });
//            })
//            .catch(error => console.error("❌ Error fetching requests:", error));
//    }
//
//    // Initial load when page opens
//    loadPendingRequests();
//});
//
//const socket = io();
//
//// Join the socket room with logged-in email (replace `USER_EMAIL` with dynamic email via templating)
//socket.emit("join", { email: USER_EMAIL });
//
//// Listen for real-time updates
//socket.on("update_requests", function (data) {
//    console.log("📥 Received update_requests:", data);
//    loadPendingRequests();  // Re-fetch from server
//});
//
//
//// Approve request function
//function approveRequest(requestId) {
//    fetch("/approve-request", {
//        method: "POST",
//        headers: { "Content-Type": "application/json" },
//        body: JSON.stringify({ id: requestId })
//    })
//    .then(response => response.json())
//    .then(data => {
//        alert(data.message);
//        loadPendingRequests(); // Refresh requests after approval
//    })
//    .catch(error => console.error("Error approving request:", error));
//}
//
//// Reject request function
//function rejectRequest(requestId) {
//    fetch("/reject-request", {
//        method: "POST",
//        headers: { "Content-Type": "application/json" },
//        body: JSON.stringify({ id: requestId })
//    })
//    .then(response => response.json())
//    .then(data => {
//        alert(data.message);
//        loadPendingRequests(); // Refresh requests after rejection
//    })
//    .catch(error => console.error("Error rejecting request:", error));
//}

document.addEventListener("DOMContentLoaded", function () {
    const viewRequestsBtn = document.getElementById("viewRequestsBtn");
    const pendingRequestsContainer = document.getElementById("pendingRequests");

    viewRequestsBtn.addEventListener("click", function () {
        fetch("/get_pending_requests")
            .then(response => response.json())
            .then(data => {
                pendingRequestsContainer.innerHTML = ""; // Clear old data

                if (data.length === 0) {
                    pendingRequestsContainer.innerHTML = "<p>No pending requests found.</p>";
                } else {
                    data.forEach(req => {
                        const div = document.createElement("div");
                        div.innerHTML = `
                            <p><strong>${req.sender_email}</strong> requested <strong>${req.file_name}</strong></p>
                            <button onclick="approveRequest('${req._id}')">Approve</button>
                            <button onclick="rejectRequest('${req._id}')">Reject</button>
                        `;
                        pendingRequestsContainer.appendChild(div);
                    });
                }
            })
            .catch(error => {
                console.error("Error fetching pending requests:", error);
                pendingRequestsContainer.innerHTML = "<p>Error loading requests.</p>";
            });
    });
});

function approveRequest(id) {
    fetch("/approve-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        document.getElementById("viewRequestsBtn").click(); // Reload list
    });
}

function rejectRequest(id) {
    fetch("/reject-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        document.getElementById("viewRequestsBtn").click(); // Reload list
    });
}



