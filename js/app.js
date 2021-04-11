$(document).ready(function () {
  let item, author, searchData, i, pressFixMore, kol
  let maxBooksOnPg = 12
  let totalItems = 1
  const outputList = document.getElementById("list-output")
  const found = document.getElementById("found")
  const bookUrl = 'https://www.googleapis.com/books/v1/volumes?&q='
  const placeHldr = '<img src="https://via.placeholder.com/150">'
  const undef = 'no information'

  //listener for search button
  $("#search").click(function () {
    if (searchData !== $("#search-box").val()) {
      cleanList()
      kol = 0
      searchBooks()
    }
  })

  //press Enter
  $("#search-box").keyup(function (event) {
    if (event.keyCode === 13) {
      $("#search").click()
    }
  });

  //press More Books 
  $("#next-page").click(function () {
    if (pressFixMore === 1) {
      pressFixMore = 0
      searchBooks()
    }
  })

  function searchBooks() {
    searchData = $("#search-box").val()
    //handling empty search input field
    if (searchData === "" || searchData === null) {
      displayError()
    }
    else {
      $.ajax({
        url: (bookUrl + searchData + "&startIndex=" + kol + "&maxResults=" + maxBooksOnPg),
        dataType: "json",
        success: function (response) {
          if (response.totalItems === 0) {
            displayError()
          }
          else {
            clickAnimate()
            displayResults(response)
          }
        },
        error: function () {
          displayError()
        }
      })
    }
    //$("#search-box").val("")
  }

  function displayResults(response) {

    for (i = 0; i < response.items.length; i++) {

      item = response.items[i]
      totalItems = response.totalItems
      title1 = item.volumeInfo.title.split(';')[0]
      author = item.volumeInfo.authors ? item.volumeInfo.authors[0] : undef
      publisher1 = item.volumeInfo.publisher ? item.volumeInfo.publisher : undef
      publishedDate = item.volumeInfo.publishedDate ? item.volumeInfo.publishedDate.substr(0, 4) : undef
      bookLink1 = item.volumeInfo.previewLink
      bookImg1 = (item.volumeInfo.imageLinks) ? item.volumeInfo.imageLinks.thumbnail : placeHldr
      bookInfo = item.volumeInfo.infoLink

      
      outputList.innerHTML += formatOutput(bookImg1, title1, author, publisher1, publishedDate, bookLink1, bookInfo)
    }
    pressFixMore = 1
    $("#next-page").css("display", "inline")
    numberBooks()
    moreBook()
  }

  function numberBooks() {
    kol += i
    let foundBooks = `<h5>Found ${totalItems} books, in page ${kol} books</h5>`
    found.innerHTML = foundBooks
  }

  function moreBook() {
    if (kol >= totalItems) {
      battonРide()
    }
  }

  function cleanList() { outputList.innerHTML = "" }

  //search books animation
  function clickAnimate() {
    $("#google").animate({
      fontSize: $('google').css('font-size') == '35px' ? "55px" : '35px',
      opacity: 0.8,
      //marginTop: '50px',
      height: 'auto'
    },
      1000)
    $("#title").animate({ 'margin-top': '5px' }, 1000) 
    $(".book-list").css({ visibility: "visible" })
    $("body").css({ opacity: 0.5 }).animate({ opacity: 1.0 }, 1000)
  }

  function battonРide() {
    $("#next-page").css("display", "none")
  }

  function formatOutput(bookImg, title, author, publisher, publishedDate, bookLink, bookInfo) {
    let bookImg1 = bookImg
    if (bookImg1.indexOf('<img') != -1)
      bookImg = 'img/noBook.jpg'
    let htmlCard = `<div class="col-12 col-md-4 col-lg-4 mb-3">
       <div id = "post"  class="card">
         <div class="row no-gutters">
           <div class="col-lg-4">
             <img src="${bookImg}" class="card-img mt-auto">
           </div>
           <div class="col-lg-8">
             <div class="card-body">
               <h4 class="card-title">${title}</h4>
               <p class="card-text"><b> Author:</b> ${author}</p>
               <p class="card-text"><b> Publisher:</b> ${publisher}</p>
			   <p class="card-text"><b>Published Date:</b> ${publishedDate}</p>
			   <a target="_blank" href="${bookInfo}" class ="btn btn-secondary">Read More ></a>			   
             </div>
           </div>
         </div>
       </div>
     </div>`
    return htmlCard
  }

  //error function
  function displayError() {
    cleanList()
    $(".book-list").css({ visibility: "visible" })
    battonРide()
    let foundBooks = `Search unsuccessful &#128560;`
    found.innerHTML = foundBooks
  }
});
