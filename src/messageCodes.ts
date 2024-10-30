const MessageCodes = {
    USER_EXISTED: "User already exists. Maybe mail or username already registered to another account",
    USER_MAIL_EXISTED: "Email already register to another account or this username already exists",
    USER_NOT_EXISTED:"Cannot found user",
    POST_NOT_EXISTED: "Cannot found post",
    NOT_OWN_POST: "You cannot do this interaction to others' post",
    NaN: " is not a number",
    DATABASE_BUSY: "Database is being accessed by other users",
    NOT_UPVOTE_YET: "You must upvote this post before using this function",
    NOT_DOWNVOTE_YET: "You must downvote this post before using this function",
    ALREADY_UPVOTE: "You already upvoted this post",
    ALREADY_DOWNVOTE: "You already downvoted this post",
}

export default MessageCodes;



