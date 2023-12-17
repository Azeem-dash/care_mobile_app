export const serverIp = 'http://192.168.1.145:4000';
//10.62.61.170.
const apiList = {
  signup: `${serverIp}/auth/signup`,
  login: `${serverIp}/auth/login`,
  getUserDate: `${serverIp}/api/user`,
  getQuiz: `${serverIp}/api/getquiz`,
  SubmitQuiz: `${serverIp}/api/saveScore`,
  GetMonthData: `${serverIp}/api/getQuizData`,
  GetMoodActivity: `${serverIp}/api/getMoodActivities`,
  GetDisplayActivity: `${serverIp}/api/getActivities`,
  GetDashboardData: `${serverIp}/api/getDashboardData`,
  GetMoodOnScore: `${serverIp}/api/getmood`,
  GetTodayData: `${serverIp}/api/getmood`,
  GetDailyData: `${serverIp}/api/getQuizData`,
};

export default apiList;
