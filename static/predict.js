function loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', (err) => reject(err));
      img.src = url;
    });
}

function displayData(museum, image_url, object_link, title, targetTags, queryTags) {
  var iconSpan = document.createElement('span')
  iconSpan.innerHTML = "north_east";
  iconSpan.classList.add('material-icons');
  var a = document.createElement('a');
  a.setAttribute('href', object_link);
  a.innerHTML = title;
  a.target="_blank";
  a.appendChild(iconSpan);
  
  if (document.getElementById(`${museum}_img_title`).childElementCount === 0) {
    document.getElementById(`${museum}_img_title`).appendChild(a);
  }

  $(`#${museum}_img_1`).css('background-image', 'url("' +  image_url + '")');
  $(`#${museum}_query_title`).text("Your Image");

  for (let i = 0; i < 5; i++) {
    x = i + 1

    $(`div#${museum}_query_tag_body_${x}`).text(Object.keys(queryTags)[i]);
    $(`div#${museum}_query_tag_pred_${x}`).text(Object.values(queryTags)[i]);
    $(`div#${museum}_query_tag_pred_${x}`).css('text-align', 'right');
    $(`div#${museum}_match_tag_body_${x}`).text(Object.keys(targetTags)[i]);
    $(`div#${museum}_match_tag_pred_${x}`).text(Object.values(targetTags)[i]);
    $(`div#${museum}_match_tag_pred_${x}`).css('text-align', 'right');
  } 
}

function clearData(museum) {
  document.getElementById(`${museum}_error`).style.display = 'none';

  $(`#${museum}_img_1`).css('background-image', 'url("")');
  $(`#${museum}_img_title`).text("");
  $(`#${museum}_query_title`).text("");

  for (let i = 0; i < 5; i++) {
    x = i + 1
    $(`div#${museum}_query_tag_body_${x}`).text("");
    $(`div#${museum}_query_tag_pred_${x}`).text("");
    $(`div#${museum}_match_tag_body_${x}`).text("");
    $(`div#${museum}_match_tag_pred_${x}`).text("");
  } 
}

function getDataCooper(data,csvUpload) {
  var museum = 'cooper';
  clearData(museum);
  document.getElementById("cooper_lazy").style.display = 'grid';

  if (csvUpload == true) {
    var image_url = data['image_url']
    var title = data['title']
    var object_link = data['artwork_page']
    var queryTags = data['query_tags'];
    var objectTags = data['top_tags'];
    var objectID = data['top_id'];

    if (objectTags.length > 0) {
      var targetTags = objectTags.shift();
      var targetID = objectID.shift();
      var targetTitle = title.shift()
      var targetObjectLink = object_link.shift()
      var targetImageUrl = image_url.shift()

      var fallbackData = {
        'image_url': data['image_url'].splice(0),
        'title': data['title'].splice(0),
        'query_tags': data['query_tags'],
        'artwork_page': data['artwork_page'].splice(0),
        'top_tags': data['top_tags'].slice(0),
        'top_id': data['top_id'].slice(0)
      }

      return loadImage(targetImageUrl)
      .then(function(img) {
        console.log(img);
        document.getElementById("cooper_lazy").style.display = 'none';
        displayData(museum, targetImageUrl, targetObjectLink, targetTitle, targetTags, queryTags);
        })
      .catch(function(err) {
        console.log(err);
        getDataTate(fallbackData);
      })
    } else {
      document.getElementById("cooper_lazy").style.display = 'none'
      document.getElementById("cooper_error").style.display = 'grid'; 
    }
  } else {
    var image_url;
    var title;
    var object_link;
    var queryTags = data['query_tags'];
    var objectTags = data['top_tags'];
    var objectID = data['top_id'];

    if (objectTags.length > 0) {
      var targetTags = objectTags.shift();
      var targetID = objectID.shift();
      var fallbackData = {
        'query_tags': data['query_tags'],
        'top_tags': data['top_tags'].slice(0),
        'top_id': data['top_id'].slice(0)
      }

      var endpoint = "https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.objects.getInfo&accession_number=";
      var api_key //insert API key here
      url = endpoint + String(targetID) + api_key;

      var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
      
      return fetch(url, requestOptions)
      .then(response => response.json())
      .then(function (response) {
        image_url = response['object']['images'][0]['z']['url'];
        title = response['object']['title']
        object_link = response['object']['url']

      return loadImage(image_url)
      .then(function(img) {
        console.log(img);
        document.getElementById("cooper_lazy").style.display = 'none';
        displayData(museum, image_url, object_link, title, targetTags, queryTags);
        })
      .catch(function(err) {
        console.log(err);
        getDataCooper(fallbackData);
      })
      })
      .catch(function(err) {
        console.log(err);
        getDataCooper(fallbackData);
      })
    } else {
      document.getElementById("cooper_lazy").style.display = 'none'
      document.getElementById("cooper_error").style.display = 'grid';
    }
  }
}

function getDataTate(data) {
  var museum = 'tate';
  clearData(museum);
  document.getElementById("tate_lazy").style.display = 'grid';
  var image_url = data['image_url']
  var title = data['title']
  var object_link = data['artwork_page']
  var queryTags = data['query_tags'];
  var objectTags = data['top_tags'];
  var objectID = data['top_id'];

  if (objectTags.length > 0) {
    var targetTags = objectTags.shift();
    var targetID = objectID.shift();
    var targetTitle = title.shift()
    var targetObjectLink = object_link.shift()
    var targetImageUrl = image_url.shift()

    var fallbackData = {
      'image_url': data['image_url'].splice(0),
      'title': data['title'].splice(0),
      'query_tags': data['query_tags'],
      'artwork_page': data['artwork_page'].splice(0),
      'top_tags': data['top_tags'].slice(0),
      'top_id': data['top_id'].slice(0)
    }

    return loadImage(targetImageUrl)
    .then(function(img) {
      console.log(img);
      document.getElementById("tate_lazy").style.display = 'none';
      displayData(museum, targetImageUrl, targetObjectLink, targetTitle, targetTags, queryTags);
      })
    .catch(function(err) {
      console.log(err);
      getDataTate(fallbackData);
    })
  } else {
    document.getElementById("tate_lazy").style.display = 'none'
    document.getElementById("tate_error").style.display = 'grid'; 
  }
}


function getDataMet(data, csvUpload) {
  var museum = 'met';
  clearData(museum);
  document.getElementById("met_lazy").style.display = 'grid';

  if (csvUpload === true) {
    var image_url = data['image_url']
    var title = data['title']
    var object_link = data['artwork_page']
    var queryTags = data['query_tags'];
    var objectTags = data['top_tags'];
    var objectID = data['top_id'];

    if (objectTags.length > 0) {
      var targetTags = objectTags.shift();
      var targetID = objectID.shift();
      var targetTitle = title.shift()
      var targetObjectLink = object_link.shift()
      var targetImageUrl = image_url.shift()

      var fallbackData = {
        'image_url': data['image_url'].splice(0),
        'title': data['title'].splice(0),
        'query_tags': data['query_tags'],
        'artwork_page': data['artwork_page'].splice(0),
        'top_tags': data['top_tags'].slice(0),
        'top_id': data['top_id'].slice(0)
      }

      return loadImage(targetImageUrl)
      .then(function(img) {
        console.log(img);
        document.getElementById("met_lazy").style.display = 'none';
        displayData(museum, targetImageUrl, targetObjectLink, targetTitle, targetTags, queryTags);
        })
      .catch(function(err) {
        console.log(err);
        getDataTate(fallbackData);
      })
    } else {
      document.getElementById("met_lazy").style.display = 'none'
      document.getElementById("met_error").style.display = 'grid'; 
    }
  
  } else {
    var image_url;
    var title;
    var object_link;
    var queryTags = data['query_tags'];
    var objectTags = data['top_tags'];
    var objectID = data['top_id'];

    if (objectTags.length > 0) {
      var targetTags = objectTags.shift();
      var targetID = objectID.shift();

      var fallbackData = {
        'query_tags': data['query_tags'],
        'top_tags': data['top_tags'].slice(0),
        'top_id': data['top_id'].slice(0)
      }

      var endpoint = "https://collectionapi.metmuseum.org/public/collection/v1/objects/";
      url = endpoint + String(targetID) 

      var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
      
      return fetch(url, requestOptions)
      .then(response => response.json())
      .then(function (response) {
        image_url = response['primaryImage']
        title = response['title']
        object_link = response['objectURL']


      return loadImage(image_url)
      .then(function(img) {
        console.log(img);
        document.getElementById("met_lazy").style.display = 'none';
        displayData(museum, image_url, object_link, title, targetTags, queryTags);
        })
      .catch(function(err) {
        console.log(err);
        getDataMet(fallbackData)
      })
      })
      .catch(function(err) {
        console.log(err);
        getDataMet(fallbackData)
      })
    } else {
      document.getElementById("met_lazy").style.display = 'none'
      document.getElementById("met_error").style.display = 'grid';
    }
  }
}

// currently not in app – API only
function getDataSMG(data) {
  var museum = 'smg';
  clearData(museum);
  document.getElementById("smg_lazy").style.display = 'grid';

  var image_url;
  var title;
  var object_link;
  var queryTags = data['query_tags'];
  var objectTags = data['top_tags'];
  var objectID = data['top_id'];
  
  if (objectTags.length > 0) {
    var targetTags = objectTags.shift();
    var targetID = objectID.shift();

    var fallbackData = {
      'query_tags': data['query_tags'],
      'top_tags': data['top_tags'].slice(0),
      'top_id': data['top_id'].slice(0)
    }

    var endpoint = "https://collection.sciencemuseumgroup.org.uk/objects/";
    url = endpoint + String(targetID) 
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    return fetch(url, requestOptions)
    .then(response => response.json())
    .then(function (response) {
      data = response['data']['attributes']
      image_url = data['multimedia'][0]['@processed']['large']['location']
      title = data['title'][0]['value']
      object_link = url

    return loadImage(image_url)
    .then(function(img) {
      document.getElementById("smg_lazy").style.display = 'none';
      displayData(museum, image_url, object_link, title, targetTags, queryTags);
      })
    .catch(function(err) {
      console.log(err);
      getDataSMG(fallbackData)
    })
    })
    .catch(function(err) {
      console.log(err);
      getDataSMG(fallbackData)
    })
  } else {
    document.getElementById("smg_lazy").style.display = 'none'
    document.getElementById("smg_error").style.display = 'flex';
  }
}

$('#doodle_predict').click(function () {
  img = canvas.toDataURL();

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "query_img": img
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("/museum-retriever", requestOptions)
  .then(function (response) {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(response);
    }
  }).then(async function (data) {
    var getDataAll = [getDataMet(data['match_data']['met'],csvUpload=true), getDataCooper(data['match_data']['cooper'],csvUpload=true), getDataTate(data['match_data']['tate'])]
    return Promise.all(getDataAll)
  }
  ).then(function (data) {
    }).catch(function (error) {
      console.warn(error);
    }); 

})


$('#image_predict').click(function () {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "query_img": base64
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("/museum-retriever", requestOptions)
  .then(function (response) {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(response);
    }
  }).then(function (data) {
    var getDataAll = [getDataMet(data['match_data']['met'],csvUpload=true), getDataCooper(data['match_data']['cooper'],csvUpload=true), getDataTate(data['match_data']['tate'])]
    return Promise.all(getDataAll)
  }
  ).then(function (data) {
    }).catch(function (error) {
      console.warn(error);
    }); 

    })


