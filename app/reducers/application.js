import * as actionTypes from '@actions/actionTypes';
const initialState = {
  questions: {
      description: null,
      image: null,
      mood: null,
      name: null,
      _id: 1,
  },
  quizData: {
    mood: '',
    date: '',
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_SCORE:
      return {
        questions: state.questions,
        // quizData: state.quizData
      };
    case actionTypes.SAVE_MOOD:
      return {
        questions: state.questions,
        quizData: {mood: action.mood, date: action.date}
      };
    default:
      return state;
  }
};
