import React, {Component} from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      items: [],
      isLoaded: false,
    }
  }

  isPublication(type) {
        return (type === 'publication') ? true : false;
    }

  componentDidMount() {
      // on récupère notre clé api
      const params = new URLSearchParams();
      params.append('username', 'decouverte+2@wizbii.com');
      params.append('grant_type', 'password');
      params.append('password', 'decouverte');
      params.append('client_id', 'test');
      axios.post('https://api.wizbii.com/v1/account/validate', params)
          .then(response=>{
              this.setState( {
                  token : response.data['access-token']
              });
              //on injecte notre token dans notre appel api
              axios.post("https://api.wizbii.com/v2/dashboard/?direction=newest", {}, {
                  headers: { Authorization: "Bearer " + this.state.token }
              })
                  // on récupère les données de notre api
                  .then(response => {
                        console.log(response);
                      this.setState({
                          items: response.data.feed_items.feed_items,
                          isLoaded: true,
                       });


                  })
                  // on traite ici les erreurs potentielles de connection à l'api
                  .catch(error => {
                      console.log(error);
                      this.setState({
                          error: 'Impossible de se connecter ',
                      })
                  });
              }
          );
  }

  

render() {
    var {error, isLoaded, items} =this.state;
    //on vérifie q'il y a des erreurs de connection
    if (error) {
      return <div>Erreur : {error}</div>;
    }
    // on vérifie que l'appel est bien chargé
    else if (!isLoaded) {
      return <div>Chargement...</div>;
    }
    // notre rendu s'il n'y a pas d'erreur et que c'est bien chargé
    else {
      return (
        <div className="App container-fluid col-md-6 offset-md-3 ">
          <ul>
           {this.state.items.map((item, index)=>(

                <li className="blocActu" key={index}>
                    <p className="titreActu">{ this.isPublication(item.type) ? item.publication.company.name : ''}</p>

                    <p>{ this.isPublication(item.type) ? item.publication.company.tag_line : ''}</p>
                    <p>{ this.isPublication(item.type) ? item.publication.company.industry : ''}</p>
                    <p>{ this.isPublication(item.type) ? item.publication.company.website : ''}</p>
                    <p>{ this.isPublication(item.type) ? item.publication.content : ''}</p>
                    <p>{ this.isPublication(item.type) ? item.publication.comments : ''}</p>

                    <p className="dateActu">{item.date}</p>
                    <p className="">{item.type}</p></li>
           ))}</ul>

        </div>
      );
    }
  }
}

export default App;

