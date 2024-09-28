function getData2(response) {
  console.log(response['match_data'])      
}

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
  
  document.getElementById(`${museum}_img_title`).appendChild(a);
  // document.getElementById(`${museum}_img_title`).appendChild(iconSpan);

  $(`#${museum}_img_1`).css('background-image', 'url("' +  image_url + '")');
  
  // $(`#${museum}_img_title`).text(title);
  // document.getElementById(`${museum}_img_title`).appendChild(iconSpan);
  // $(`#${museum}_img_title`).text("Match #1");

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
  $(`#${museum}_img_1`).css('background-image', 'url("")');
  
  // $(`#${museum}_img_title`).text(title);
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

//http://www.javascriptkit.com/javatutors/javascriptpromises.shtml
function getDataCooper(data) {
  var museum = 'cooper';
  clearData(museum);
  document.getElementById("cooper_lazy").style.display = 'grid';
  var image_url;
  var title;
  var object_link;
  var queryTags = data['query_tags'];
  var objectTags = data['top_tags'];
  var objectID = data['top_id'];
  var targetTags = objectTags.shift();
  var targetID = objectID.shift();
  var endpoint = "https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.objects.getInfo&accession_number=";
  var api_key = config.COOPER_API_KEY //TODO figure out env
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
     getDataCooper(data);
   })
   
  })
}

function getDataTate(data) {
  var museum = 'met';
  clearData(museum);
  document.getElementById("met_lazy").style.display = 'grid';
  var image_url = data['image_url']
  var title = data['title']
  var object_link = data['artwork_page']
  var queryTags = data['query_tags'];
  var objectTags = data['top_tags'];
  var objectID = data['top_id'];
  var targetTags = objectTags.shift();
  var targetID = objectID.shift();
  var targetTitle = title.shift()
  var targetObjectLink = object_link.shift()
  var targetImageUrl = image_url.shift()

   return loadImage(targetImageUrl)
   .then(function(img) {
     console.log(img);
     document.getElementById("met_lazy").style.display = 'none';
     displayData(museum, targetImageUrl, targetObjectLink, targetTitle, targetTags, queryTags);
    })
   .catch(function(err) {
     console.log(err);
     getDataTate(data);
   })
}


function getDataMet(data) {
  var museum = 'cooper';
  clearData(museum);
  document.getElementById("cooper_lazy").style.display = 'grid';

  
  var image_url;
  var title;
  var object_link;
  var queryTags = data['query_tags'];
  var objectTags = data['top_tags'];
  var objectID = data['top_id'];
  var targetTags = objectTags.shift();
  var targetID = objectID.shift();
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
     document.getElementById("cooper_lazy").style.display = 'none';
     displayData(museum, image_url, object_link, title, targetTags, queryTags);
    })
   .catch(function(err) {
     console.log(err);
     getDataMet(data)
   })
   
  })
}


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
  var targetTags = objectTags.shift();
  var targetID = objectID.shift();

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
    console.log(response)
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
     getDataSMG(data)
   })
  })
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

  // fetch("http://80.85.87.85:8000/museum-retriever", requestOptions)
  fetch("http://localhost:8000/museum-retriever", requestOptions)
  .then(function (response) {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(response);
    }
  }).then(async function (data) {
    //TODO get all data here when env sorted
    // var getDataAll = [getDataCooper(data['match_data']['cooper']), getDataMet(data['match_data']['met']), getDataSMG(data['match_data']['science'])] 
    var getDataAll = [getDataMet(data['match_data']['met']), getDataSMG(data['match_data']['science']), getDataTate(data['match_data']['tate'])]
    return Promise.all(getDataAll)
  }
  ).then(function (data) {
      console.log('nice');
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

  fetch("http://127.0.0.1:5000/museum-retriever", requestOptions)
  .then(function (response) {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(response);
    }
  }).then(function (data) {
    var getDataAll = [getDataCooper(data['match_data']['cooper']), getDataMet(data['match_data']['met']), getDataSMG(data['match_data']['science'])]
    return Promise.all(getDataAll)
  }
  ).then(function (data) {
      console.log('nice');
    }).catch(function (error) {
      
      console.warn(error);
    }); 

    })


