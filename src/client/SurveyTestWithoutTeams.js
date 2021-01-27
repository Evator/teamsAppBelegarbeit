import React from 'react';
import ReactDOM from 'react-dom';
import * as Survey from 'survey-react';
import 'survey-react/modern.css';
import 'survey-react/survey.css';
import './completed.css';


const defaultThemeColors = Survey
  .StylesManager
  .ThemeColors.modern;

defaultThemeColors['$main-color'] = '#00008B'; // purple- the theme's underlines and button'
defaultThemeColors['$main-hover-color'] = '#6fe06f';
defaultThemeColors['$text-color'] = '#000000'; // questions text
defaultThemeColors['$header-color'] = '#00008B'; // survey header
defaultThemeColors['$header-background-color'] = '#87CEEB';
defaultThemeColors['$body-container-background-color'] = '#87CEEB';


Survey
  .StylesManager
  .applyTheme('modern');

Survey.surveyStrings.progressText = 'Seite {0} von {1}';
Survey.showPreviewBeforeComplete = 'showAnsweredQuestions';


const surveyjson = {
  locale: 'de',
  title: 'XY-Befragung',
  logoPosition: 'top',
  logo: 'https://tu-dresden.de/bu/wirtschaft/winf/wiim/ressourcen/bilder/area_logo.gif/@@images/b2787c1d-6984-41e1-ab96-f66f80f247c6.jpeg',
  logoWidth: 200,
  logoHeight: 160,
  showPrevButton: 'true',
  showProgressBar: 'bottom',
  firstPageIsStarted: true,
  pagePrevText: 'Zurück',
  pageNextText: 'Weiter',
  startSurveyText: 'Befragung starten',

  pages: [
    {
      questions: [
        {
          type: 'html',
          html: 'Wir freuen uns über Ihr Interesse an unserem Projekt! <p></p> <br/> Ziel dieser Studie ist die Untersuchung von XYZ. Auf Grundlage der Forschungsergebnisse kann XYZ entwickelt und das Verständnis für XYZ verbessert werden. <br/> Hierbei können Sie einen maßgeblichen Teil beitragen!'
                        + '<p></p> <strong><em><br /><span>Wie ist die Befragung aufgebaut?</span><br /></em></strong><br />'
                        + 'Die Befragung besteht aus X Teilen, welche jeweils X Minuten in Anspruch nehmen. Dabei beträgt die Gesamtdauer der Befragung ca. x Minuten.'
                        + '<p></p> <strong><em><br /><span>Vielen Dank für Ihr Interesse!</span><br /></em></strong><br />'
                        + '<p>Im Folgenden können Sie mit der Online-Befragung beginnen.</p>'
                        + 'Studienleitung: <br />'
                        + 'Max Mustermann<br />'
                        + 'Kontakt: maxmustermann@tu-dresden.de<br />'


        }
      ]
    }, {
      questions: [
        {
          type: 'radiogroup',
          name: 'Rolle',
          isRequired: true,
          title: 'Welche Position nehmen Sie in Ihrem Unternehmen ein?',
          choices: [
            'Geschäftsführer', 'Bereichsleiter', 'Abteilungsleiter', 'Gruppenleiter', 'Mitarbeiter'
          ],

        }
      ]
    }, {
      questions: [
        {
          type: 'text',
          name: 'GeschäftsführerFrage1',
          visibleIf: "{Rolle}='Geschäftsführer'",
          title: 'Was möchten Sie für die Mitarbeiter dieses Unternehmens?',
          placeHolder: 'Wohlstand',
          isRequired: true,
          autoComplete: 'name'

        }
      ]
    }, {
      questions: [
        {
          type: 'matrix',
          name: 'Quality',
          visibleIf: "{Rolle}='Geschäftsführer'",
          isAllRowRequired: 'true',
          title: 'Inwiefern treffen diese Aussagen Ihrer Meinung nach zu?',
          columns: [
            {
              value: 1,
              text: 'trifft gar nicht zu'
            }, {
              value: 2,
              text: 'trifft eher nicht zu'
            }, {
              value: 3,
              text: 'Neutral'
            }, {
              value: 4,
              text: 'trifft eher zu'
            }, {
              value: 5,
              text: 'trifft voll und ganz zu'
            }
          ],
          rows: [
            {
              value: 'Matrixfrage1',
              text: 'Ihrem Unternehmen war es durch die Nutzung von digitalen Kommunikationstools möglich, einen Wettbewerbsvorteil zu erlangen.'
            }, {
              value: 'Matrixfrage2',
              text: 'Ihr digitales Geschäftsmodell ist skalierbar.'
            }, {
              value: 'Matrixfrage3',
              text: 'Durch die Nutzung von digitalen Kommunikationstools konnte Ihr Unternehmen die Geschwindigkeit von Innovationen erhöhen.'
            }, {
              value: 'Matrixfrage4',
              text: 'Digitale Lösungen erhöhen die Effizienz in Ihrem Unternehmen.'
            }
          ]
        }
      ]
    },
    {
      questions: [
        {
          type: 'dropdown',
          name: 'Auto',
          visibleIf: "{Rolle}='Bereichsleiter' or {Rolle}='Abteilungsleiter' ",
          title: 'Welches Auto fahren Sie?',
          isRequired: true,
          colCount: 0,
          choices: [
            'Kein Auto',
            'Ford',
            'Vauxhall',
            'Volkswagen',
            'Nissan',
            'Audi',
            'Mercedes-Benz',
            'BMW',
            'Peugeot',
            'Toyota',
            'Citroen'
          ]
        },
        {
          type: 'dropdown',
          name: 'Sport',
          visibleIf: "{Rolle}='Bereichsleiter' or {Rolle}='Abteilungsleiter' ",
          title: 'Welche Sportart favorisieren Sie?',
          isRequired: true,
          colCount: 0,
          choices: [
            'Keine Sportart',
            'Reiten',
            'Fußball',
            'Schwimmen',
            'Fechten',
            'Turmspringen',
            'Volleyball',
            'Bodenturnen',
            'Skispringen',
            'Langlauf',
            'Schach'
          ]
        },
      ],
    },
    {
      questions: [
        {
          type: 'rating',
          visibleIf: "{Rolle}='Mitarbeiter'",
          isRequired: true,
          name: 'Zufriendenheit1',
          title: 'Wie zufrieden sind Sie mit Ihrem Unternehmen?',
          minRateDescription: 'Unzufrieden',
          maxRateDescription: 'Sehr Zufrieden'
        },
        {
          type: 'rating',
          visibleIf: "{Rolle}='Mitarbeiter'",
          isRequired: true,
          name: 'Zufriendenheit2',
          title: 'Wie zufrieden sind Sie mit der Führung Ihres Unternehmens?',
          minRateDescription: 'Unzufrieden',
          maxRateDescription: 'Sehr Zufrieden'
        }
      ],
    },
    {
      questions: [
        {
          type: 'imagepicker',
          name: 'WahlBild',
          isRequired: true,
          visibleIf: "{Rolle}='Gruppenleiter'",
          title: 'Welches Tier sehen Sie als erstes?',
          choices: [
            {
              value: 'lion',
              imageLink: 'https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg'
            }, {
              value: 'giraffe',
              imageLink: 'https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg'
            }, {
              value: 'panda',
              imageLink: 'https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg'
            }, {
              value: 'camel',
              imageLink: 'https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg'
            }
          ]
        },
      ],
    },


  ],


};


export default class SurveyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCompleted: false, results: '', Mitarbeiter_ID: 'D1x231xfwwda42dwada3raw33', Team_Name: 'NokAG', Mail: 'abc@web.de'
    };
    this.onCompleteComponent = this.onCompleteComponent.bind(this);
  }

  onCompleteComponent(survey, options) {
    const surveyresults = survey.data;
    surveyresults.Mitarbeiter_ID = this.state.Mitarbeiter_ID;
    surveyresults.Team_Name = this.state.Team_Name;
    surveyresults.Mail = this.state.Mail;


    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyresults)
      };

      fetch('http://localhost:8080/surveydata', requestOptions)
        .then(response => response.json())
        .then(this.setState({ isCompleted: true }));
    } catch (e) {
      console.log(e);
    }
  }

  getModel(json) {
    const model = new Survey.Model(json);
    return (<Survey.Survey model={model} onComplete={this.onCompleteComponent} showCompletedPage={false} />);
  }


  render() {
    const surveyRender = !this.state.isCompleted ? (
      this.getModel(surveyjson)
    ) : null;
    const onCompleteComponent = this.state.isCompleted ? (
      <div className="completed">
        <img className="completedPageLogo" alt="w.i.i.m.-Logo" src="https://tu-dresden.de/bu/wirtschaft/winf/wiim/ressourcen/bilder/area_logo.gif/@@images/b2787c1d-6984-41e1-ab96-f66f80f247c6.jpeg" />
        <p />
        <p className="completedPageTitle">
          <strong><em>Ende der Befragung</em></strong>
        </p>
        <p className="completedPageText">Sie haben die Umfrage erfolgreich abgeschlossen! Wir danken Ihnen für Ihre Zeit!</p>
        <p className="completedPageText">Bei weiteren Fragen können Sie sich an folgende E-Mail-Adresse wenden:</p>
        <p className="completedPageText">max.mustermann@yahoo.com</p>

        <p className="completedPageText">Wir danken Ihnen vielmals für Ihr Interesse!</p>
      </div>
    ) : null;
    return (
      <div>
        {surveyRender}
        {onCompleteComponent}
      </div>
    );
  }
}
