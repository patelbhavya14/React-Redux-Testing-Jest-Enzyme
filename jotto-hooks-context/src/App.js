import React from "react";
import hookActions from "./actions/hookActions";
import languageContext from "./contexts/languageContext";
import successContext from "./contexts/successContext";
import guessedWordsContext from "./contexts/guessedWordsContext";
import Input from "./Input";
import LanguagePicker from "./LanguagePicker";
import GuessedWords from "./GuessedWords";
import Congrats from "./Congrats";

function reducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case "setSecretWord":
      return { ...state, secretWord: payload };
    case "setLanguage":
      return { ...state, language: payload };
    default:
      throw new Error(`Invalid action type: ${action}`);
  }
}

function App() {
  const [state, dispatch] = React.useReducer(reducer, {
    secretWord: null,
    language: "en",
  });

  const setSecretWord = (secretWord) =>
    dispatch({ type: "setSecretWord", payload: secretWord });

  const setLanguage = (language) => {
    dispatch({ type: "setLanguage", payload: language });
  };

  React.useEffect(() => {
    hookActions.getSecretWord(setSecretWord);
  }, []);

  if (!state.secretWord) {
    return (
      <div className="container" data-test="spinner">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p>Loading secret word</p>
      </div>
    );
  }

  return (
    <div className="container" data-test="component-app">
      <h1>Jotto</h1>
      <p>The secret word is {state.secretWord}</p>
      <languageContext.Provider value={state.language}>
        <LanguagePicker setLanguage={setLanguage} />
        <guessedWordsContext.GuessedWordsProvider>
          <successContext.SuccessProvider>
            <Congrats />
            <Input secretWord={state.secretWord} />
            <GuessedWords />
          </successContext.SuccessProvider>
        </guessedWordsContext.GuessedWordsProvider>
      </languageContext.Provider>
    </div>
  );
}

export default App;
