import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const CLIENT_ID = "3a254e210a494ea685487e98394be514";
const CLIENT_SECRET = "e9dd838ca9174d7e81eab1de7e38fbd4";

function App() {
  const[searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const[albums, setAlbums] = useState([]);
 
  useEffect(()=> {
    //API Access Token
    var authParameters = {
      method: 'POST',
      headers: {
        'content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }

    fetch('https://accounts.spotify.com/api/token', authParameters)
    .then(result => result.json())
    .then(data => setAccessToken(data.access_token))
  }, []) 
  

  //Search
  async function search(){
    console.log("Search for" + searchInput);

    //Get Request using search to get the Artist ID
    var searchParameters = {
      method:'GET',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + accessToken
      }
    }

    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
      .then(response => response.json())
      .then(data => console.log(data))
      .then(data => { return data.artists.item[0].id})

    console.log("Artist ID is " + artistID);

    //Get request with Artist ID grab all the albums from that artist
    var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParameters)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setAlbums(data.items);
      })
    //Display those albums to the user
  }
  console.log(albums);
  return (
    <div className="App">
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl
          placeholder='Search For Artist' 
          type='input' 
          onKeyPress={event => {
            if (event.key == "Enter") {
              search();
            }
          }}
          onChange={event => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>
            Search
          </Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className="mx-2 row row-cols-4">
          {albums.map((album, i) =>{
            console.log(album);
            return(
          <Card>
          <Card.Img src={album.images[0]} />
          <Card.Body>
            <Card.Title>{album.name}
            </Card.Title>
          </Card.Body>
        </Card>
            )
          })}

        </Row>
        
      </Container>
    </div>
  );
}

export default App;
