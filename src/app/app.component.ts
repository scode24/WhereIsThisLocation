import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'LocationPuzzle';
  score: number = 0;
  turns: number = 2;
  country1: string = "";
  country2: string = "";
  country3: string = "";
  countryList: any = [];
  photoData: any = null;
  photoUrl: string = "";
  searchCountryIndex: number = 0;
  isCorrectSelection: boolean = false;
  isGameOver: boolean = false;
  optionSelected: boolean = false;
  lastSearchedCountry: string = "";
  isFirstLoading = true;
  correctMsgList = ["Correct", "Super", "Weldone", "Remarkable", "Splendid"]
  correctMsg: string = "";

  constructor(public httpClient: HttpClient) { }

  ngOnInit(): void {
    this.generatePhotoOption(true);
  }

  generatePhotoOption(isNewGame: boolean): void {
    this.isCorrectSelection = false;
    this.optionSelected = false;
    this.isGameOver = false;
    this.turns = 2;
    this.photoData = null;

    if (isNewGame) {
      this.score = 0;
    } else {
      const msgIndex = Math.floor(Math.random() * (4 + 1))
      this.correctMsg = this.correctMsgList[msgIndex];
      this.isFirstLoading = false;
    }

    this.httpClient.get<any>('assets/countryList.json').subscribe(list => {

      let index1 = Math.floor(Math.random() * (252 + 1));
      let index2 = 0;
      let index3 = 0;

      while (true) {
        index2 = Math.floor(Math.random() * (252 + 1));
        if (index2 != index1) {
          break;
        }
      }

      while (true) {
        index3 = Math.floor(Math.random() * (252 + 1));
        if (index3 != index1 && index3 != index2) {
          break;
        }
      }


      this.searchCountryIndex = Math.floor(Math.random() * (2 + 1));
      let searchCountry = "";

      switch (this.searchCountryIndex) {
        case 0: searchCountry = list[index1].name; break;
        case 1: searchCountry = list[index2].name; break;
        case 2: searchCountry = list[index3].name; break;
      }

      if (this.lastSearchedCountry != "" && this.lastSearchedCountry == searchCountry) {
        this.generatePhotoOption(false);
      } else {
        this.lastSearchedCountry = searchCountry;
      }

      //"https://api.pexels.com/v1/search?query=nature&per_page=1"
      this.httpClient.get("https://api.pexels.com/v1/search?query=" + searchCountry + "&per_page=1", {
        "headers": new HttpHeaders({
          Authorization: environment.pixerKey
        })
      }).subscribe(data => {
        this.photoData = data;
        this.photoUrl = this.photoData.photos[0].src.landscape

        this.country1 = list[index1].name;
        this.country2 = list[index2].name;
        this.country3 = list[index3].name;
      });

    });
  }

  selectOption(option: number): void {
    this.optionSelected = true;
    if (option == this.searchCountryIndex) {
      this.score = this.score + 5;
      this.generatePhotoOption(false);
    } else {
      this.isCorrectSelection = false;
      this.turns--;
      if (this.turns == 0) {
        this.isGameOver = true;
      }
    }
  }
}


