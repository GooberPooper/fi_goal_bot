const snoowrap = require('snoowrap');
const moment = require('moment');
const parseBody = require('./helpers/parseCommentBody');

const wrapper = new snoowrap({
  userAgent: 'node:fi_goal_bot:1.0.0 (by /u/GooberPooper)',
  clientId: 'Ln6v-eukUP-X1Q',
  clientSecret: 'CHEpfvKzAUXWy22dpRCiw5-XroM',
  username: process.env.USERNAME,
  password: process.env.PASSWORD
});
const fiGoalBot = wrapper.getSubreddit('fi_goal_bot');
const getGoalComments = async (submission) => {
    return wrapper.getSubmission(submission).comments.then((comments) => comments.map(({
        author,
        body,
        id,
        replies
    }) => ({
        author: author.name,
        ...parseBody(body),
        thread: submission,
        commentId: id,
        body,
        isLogged: !!replies.find(({ author: { name } }) => name === 'fi_goal_bot')
    })));
};
const createDataThread = async (goalPosts) => {
    return fiGoalBot.submitSelfpost({
        title: `2019 Goal Progress - ${moment().format('YYYY-MM-DD')}`,
        text: JSON.stringify(goalPosts)
    })
    .then(({ name }) => name)
    .catch(console.error);
}
const respondToUsers = async (comments, dataThread) => {
    return Promise.all(comments.map(({commentId, author, dateOfNextUpdate}) => wrapper.getComment(commentId).reply(`
        /u/${author}, I got your goals!

        Your next update will occurr on ${moment(dateOfNextUpdate).format('LL')}. Expect a message in your inbox then!

        Data Thread: ${dataThread}.
    `)))
    .catch(console.error);
}
const readComments = async () => {
    const comments = await getGoalComments('a5931f');
    const forThread = comments.filter(({ isLogged, body, author }) => !isLogged && author !== '[deleted]' && body !== '[removed]');
    if(forThread.length) {
        const createdDataThread = await createDataThread(forThread);
        respondToUsers(forThread, createdDataThread);
    }
}
readComments();