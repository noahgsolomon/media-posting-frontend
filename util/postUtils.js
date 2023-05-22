import {addLikeBookmark, createComment, getLikeBookmark, getPostComments, getPosts} from "./api/postapi.js";
import {showSlideMessage} from "./status.js";
import {fetchUserProfile} from "./api/userapi.js";


const formatDateAndTime = (dateString) => {
    const dateObj = new Date(dateString);
    const now = new Date();
    const timeDifference = now - dateObj;
    const twentyFourHours = 24 * 60 * 60 * 1000;

    const formattedDate = dateObj.toLocaleDateString();
    const formattedTime = dateObj.toLocaleTimeString([], {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit'
    }).replace(/^0+/, '');

    if (timeDifference < twentyFourHours) {
        return `${formattedTime}`;
    } else {
        return `${formattedDate}`;
    }
};

async function displayPosts(profileString, call, page){

    const userDetailList = {
    }

    const postWrapper = document.querySelector('.post-wrapper');

    let postList = await getPosts(page);
    postList = JSON.parse(postList);

    for (let i = 0; i < postList.length; i++) {

        const postElement = document.createElement('div');
        postElement.className = 'post';

        if (profileString){
            const profileDetails = JSON.parse(profileString);
            if (profileDetails.cardColor){
                postElement.style.backgroundColor = profileDetails.cardColor;
            }
        }

        const titleElement = document.createElement('h2');
        titleElement.textContent = postList[i].title;

        const contentElement = document.createElement('p');
        contentElement.textContent = postList[i].body;

        const postMeta = document.createElement('div')
        postMeta.className = 'post-meta';

        const category = document.createElement('span');
        const categoryType = postList[i].category.toLowerCase().replace(/ /g, '-');
        category.className = `category ${categoryType}`;
        category.textContent = '#' + postList[i].category;

        const author = document.createElement('a');
        author.href = '#';
        author.className = 'author';
        author.textContent = postList[i].username;

        const emojiContainer = document.createElement('span');

        author.addEventListener('click', (event) => {
            const username = event.target.textContent;
            author.href = `../user/user.html?username=${username}`;
        });

        author.addEventListener('mouseover', async (event) => {
            const username = event.target.textContent.trim();
            let userDetails;
            if (userDetailList[username] !== undefined){
                userDetails = userDetailList[username]
            }
            else {
                const userString = await fetchUserProfile(username);
                userDetails = JSON.parse(userString);
                userDetailList[username] = userDetails
            }
            let emoji;
            if (userDetails.profilePic !== undefined || userDetails.profilePic !== '') {
                emoji = userDetails.profilePic;
            } else {
                emoji = '😀';
            }

            emojiContainer.textContent = emoji;
            emojiContainer.style.position = 'absolute';
            emojiContainer.style.pointerEvents = 'none';
            emojiContainer.style.fontSize = '1.2rem'
            document.body.appendChild(emojiContainer);

            author.addEventListener('mousemove', updateEmojiPosition);
        });

        author.addEventListener('mouseout', () => {
            if (document.body.contains(emojiContainer)) {
                document.body.removeChild(emojiContainer);
            }
            author.removeEventListener('mousemove', updateEmojiPosition);
        });

        function updateEmojiPosition(event) {
            const xOffset = 15;
            const yOffset = 15;
            emojiContainer.style.left = `${event.pageX + xOffset}px`;
            emojiContainer.style.top = `${event.pageY + yOffset}px`;
        }

        // const formatDateAndTimePost = (dateString) => {
        //     const dateObj = new Date(dateString);
        //     const formattedDate = dateObj.toLocaleDateString();
        //     const formattedTime = dateObj.toLocaleTimeString();
        //     return `${formattedDate} ${formattedTime}`;
        // };

        const date = document.createElement('span');
        const formattedLastModifiedDate = formatDateAndTime(postList[i].lastModifiedDate);
        date.className = 'date';
        date.textContent = formattedLastModifiedDate;

        const postActions = document.createElement('div');
        postActions.className = 'post-actions';

        const likedBookmarked = await getLikeBookmark(postList[i].id);

        const likeButton = document.createElement('button');
        likeButton.className = 'like-btn';
        if (!likedBookmarked.liked) {
            likeButton.textContent = '❤';
        } else {
            likeButton.style.backgroundColor = 'var(--liked-btn-bg)';
            likeButton.textContent = '💖';
            likeButton.setAttribute('data-clicked', 'true');
        }


        likeButton.addEventListener('click', (event) => {
            const buttonElement = event.currentTarget;
            const isClicked = buttonElement.getAttribute('data-clicked') === 'true';
            if (!isClicked) {
                postList[i].likes += 1;
                buttonElement.style.backgroundColor = 'var(--liked-btn-bg)';
                buttonElement.textContent = '💖';
                buttonElement.setAttribute('data-clicked', 'true');
            } else {
                postList[i].likes -= 1;
                buttonElement.style.backgroundColor = '';
                buttonElement.textContent = '❤';
                buttonElement.setAttribute('data-clicked', 'false');
            }

            likeCount.textContent = `${postList[i].likes} likes`
            let bookmarkStatus = false;
            if (bookmarkButton.textContent === '📚') {
                bookmarkStatus = true;
            }
            let likeStatus = false;
            if (likeButton.textContent === '💖') {
                likeStatus = true;
            }
            addLikeBookmark(postList[i].id, likeStatus, bookmarkStatus);
        });

        const bookmarkButton = document.createElement('button');
        bookmarkButton.className = 'bookmark-btn';
        if (!likedBookmarked.bookmark) {
            bookmarkButton.textContent = '💾';
        } else {
            bookmarkButton.style.backgroundColor = 'var(--bookmarked-btn-bg)';
            bookmarkButton.textContent = '📚';
            bookmarkButton.setAttribute('data-clicked', 'true');
        }

        bookmarkButton.addEventListener('click', (event) => {
            const buttonElement = event.currentTarget;
            const isClicked = buttonElement.getAttribute('data-clicked') === 'true';
            if (!isClicked) {
                buttonElement.style.backgroundColor = 'var(--bookmarked-btn-bg)';
                buttonElement.textContent = '📚';
                buttonElement.setAttribute('data-clicked', 'true');
            } else {
                buttonElement.style.backgroundColor = '';
                buttonElement.textContent = '💾';
                buttonElement.setAttribute('data-clicked', 'false');
            }
            let bookmarkStatus = false;
            if (bookmarkButton.textContent === '📚') {
                bookmarkStatus = true;
            }
            let likeStatus = false;
            if (likeButton.textContent === '💖') {
                likeStatus = true;
            }
            addLikeBookmark(postList[i].id, likeStatus, bookmarkStatus);
        });

        const postStats = document.createElement('div')
        postStats.className = 'post-stats';


        const likeCount = document.createElement('div');
        likeCount.className = 'like-count';
        likeCount.textContent = `${postList[i].likes} likes`

        postStats.append(likeCount);


        const commentContainer = document.createElement("div");
        commentContainer.className = 'comment-container';

        const commentField = document.createElement("input");
        commentField.type = 'text';
        commentField.placeholder = 'Comment here...';
        commentField.className = 'comment-field';

        const commentButton = document.createElement("button");
        commentButton.className = 'comment-btn';
        commentButton.textContent = '💬';

        const uploadComment = async ()=> {
            if (commentField.value !== ''){
                const createdComment = await createComment(postList[i].id, commentField.value);
                if (createdComment){
                    showSlideMessage("uploaded comment!", "#24bd47");
                }
                else {
                    showSlideMessage("comment could not be posted", "red");
                }
                commentField.value = '';

                if (seeComments.style.display === 'none'){
                    comments.innerHTML = '';
                    await postComments();
                }
            }

        }

        commentButton.addEventListener('click', uploadComment);
        commentField.addEventListener('keydown', (event) => {
            if (event.key === 'Enter'){
                event.preventDefault();
                uploadComment();
            }
        });


        const seeComments = document.createElement("div");
        seeComments.className = 'see-comments-container';
        seeComments.textContent = 'see all comments...';

        const comments = document.createElement("div");
        comments.className = 'comments';


        const commentsString = await getPostComments(postList[i].id);
        if (commentsString === '[]'){
            seeComments.style.display = 'none';
        }
        const postComments = async () => {
            seeComments.style.display = 'none';
            const updatedCommentsString = await getPostComments(postList[i].id);
            const commentsList = JSON.parse(updatedCommentsString);
            for (const comment of commentsList){
                const commentBox = document.createElement("div");
                commentBox.className = 'comment'

                const commentAuthor = document.createElement("a");
                commentAuthor.className = 'comment-author';
                commentAuthor.style.cursor = 'pointer';
                commentAuthor.setAttribute('data-username', comment.user);

                const commentUserString = await fetchUserProfile(comment.user);
                if (commentUserString){
                    const commentUser = JSON.parse(commentUserString);
                    if (commentUser.profilePic){
                        commentAuthor.textContent = commentUser.profilePic + ` ${comment.user}`;
                    }
                    else {
                        commentAuthor.textContent = `😀 ${comment.user}`;
                    }
                }
                else {
                    commentAuthor.textContent = `😀 ${comment.user}`;
                }


                commentAuthor.addEventListener('click', (event) => {
                    const username = event.target.dataset.username;
                    commentAuthor.href = `../user/user.html?username=${username}`;
                });

                const commentText = document.createElement("span");
                commentText.className = 'comment-text';
                commentText.textContent = comment.content;

                const commentTime = document.createElement('span');
                commentTime.className = 'comment-time';
                commentTime.textContent = formatDateAndTime(comment.date);

                const commentInfo = document.createElement("div");
                commentInfo.className = 'comment-info';

                commentBox.append(commentAuthor);
                commentBox.append(commentText);
                commentInfo.append(commentTime);
                commentBox.append(commentInfo);
                comments.append(commentBox);
            }
        }

        seeComments.addEventListener('click', postComments);

        commentContainer.append(commentField);
        commentContainer.append(commentButton);

        postMeta.append(author);
        postMeta.append(date);

        postActions.append(likeButton);
        postActions.append(bookmarkButton);

        postElement.append(titleElement);
        postElement.append(contentElement);
        postElement.append(category);
        postElement.append(postMeta);
        postElement.append(postActions);
        postElement.append(postStats);
        postElement.append(commentContainer);
        postElement.append(seeComments);
        postElement.append(comments);
        if (call === 'search'){
            const posts = document.querySelector('.posts');
            posts.append(postElement)
        }
        if (call === 'dashboard'){
            postWrapper.append(postElement);
        }
    }

}


export {formatDateAndTime, displayPosts}