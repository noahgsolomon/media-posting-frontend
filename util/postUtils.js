import {addLikeBookmark, createComment, getLikeBookmark, getPostComments} from "./api/postapi.js";
import {showSlideMessage} from "./status.js";


const formatDateAndTime = (dateString) => {
    const dateObj = new Date(dateString);
    const now = new Date();
    const timeDifference = now - dateObj;
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    const formattedDate = dateObj.toLocaleDateString();
    const formattedTime = dateObj.toLocaleTimeString
    ([], { hour12: true, hour: '2-digit', minute: '2-digit' });

    if (timeDifference < twentyFourHours) {
        return `${formattedTime}`;
    } else {
        return `${formattedDate}`;
    }
};


async function displayPosts(i, postList, profileString, postWrapper, call){

    const postElement = document.createElement('div');
    postElement.className = 'post';

    if (profileString){
        console.log(profileString);
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

    const author = document.createElement('a');
    author.href = '#';
    author.className = 'author';
    author.textContent = postList[i].username;

    author.addEventListener('click', (event) => {
        const username = event.target.textContent;
        author.href = `user.html?username=${username}`;
    });
    const formatDateAndTimePost = (dateString) => {
        const dateObj = new Date(dateString);
        const formattedDate = dateObj.toLocaleDateString();
        const formattedTime = dateObj.toLocaleTimeString();
        return `${formattedDate} ${formattedTime}`;
    };

    const date = document.createElement('span');
    const formattedLastModifiedDate = formatDateAndTimePost(postList[i].lastModifiedDate);
    date.className = 'date';
    date.textContent = formattedLastModifiedDate;

    const postActions = document.createElement('div');
    postActions.className = 'post-actions';

    const likedBookmarked = await getLikeBookmark(postList[i].id);

    const likeButton = document.createElement('button');
    likeButton.className = 'btn like-btn';
    if (!likedBookmarked.liked) {
        likeButton.textContent = '❤';
    } else {
        likeButton.style.backgroundColor = '#d72f56';
        likeButton.textContent = '💖';
        likeButton.setAttribute('data-clicked', 'true');
    }


    likeButton.addEventListener('click', (event) => {
        const buttonElement = event.currentTarget;
        const isClicked = buttonElement.getAttribute('data-clicked') === 'true';
        if (!isClicked) {
            buttonElement.style.backgroundColor = '#d72f56';
            buttonElement.textContent = '💖';
            buttonElement.setAttribute('data-clicked', 'true');
        } else {
            buttonElement.style.backgroundColor = '';
            buttonElement.textContent = '❤';
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

    const bookmarkButton = document.createElement('button');
    bookmarkButton.className = 'btn bookmark-btn';
    if (!likedBookmarked.bookmark) {
        bookmarkButton.textContent = '💾';
    } else {
        bookmarkButton.style.backgroundColor = '#be773f';
        bookmarkButton.textContent = '📚';
        bookmarkButton.setAttribute('data-clicked', 'true');
    }

    bookmarkButton.addEventListener('click', (event) => {
        const buttonElement = event.currentTarget;
        const isClicked = buttonElement.getAttribute('data-clicked') === 'true';
        if (!isClicked) {
            buttonElement.style.backgroundColor = '#be773f';
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

    const likeCount = document.createElement('div');
    likeCount.className = 'like-count';
    likeCount.textContent = '10 likes'
    //TODO add like count feature

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
                showSlideMessage("uploaded comment!", "green");
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
    console.log(commentsString)
    if (commentsString === '[]'){
        seeComments.style.display = 'none';
    }
    const postComments = async () => {
        seeComments.style.display = 'none';
        const updatedCommentsString = await getPostComments(postList[i].id);
        const commentsList = JSON.parse(updatedCommentsString);
        for (const comment of commentsList){
            console.log(comment.content);
            console.log(comment.user);
            const commentBox = document.createElement("div");
            commentBox.className = 'comment'

            const commentAuthor = document.createElement("span");
            commentAuthor.className = 'comment-author';
            commentAuthor.textContent = comment.user;

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
    postElement.append(postMeta);
    postElement.append(postActions);
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

async function postRender(postListString, profileJson, main, call){
    const postList = JSON.parse(postListString);
    postList.reverse();
    const pageNumber = Math.ceil(postList.length / 10);
    let currentPage = 0;
    const count = 0;
    const end = Math.min(count + 10, postList.length);
    const postWrapper = document.querySelector('.post-wrapper');

    for (let i = currentPage * 10; i < end; i++) {
        await displayPosts(i, postList, profileJson, postWrapper, call);
    }
    const pageNumberContainer = document.createElement("div");
    pageNumberContainer.className = 'page-number-container';
    for (let i = 0; i < pageNumber; i++) {
        const pageNumberDiv = document.createElement("div");
        pageNumberDiv.className = `page-number page-${i}`;
        pageNumberDiv.textContent = i.toString();
        pageNumberContainer.appendChild(pageNumberDiv);
        pageNumberDiv.addEventListener('click', async () => {
            const clickedPage = parseInt(pageNumberDiv.textContent);
            if (clickedPage !== currentPage){
                currentPage = clickedPage;
                if (call === 'dashboard'){
                    postWrapper.innerHTML = '';
                }
                if (call === 'search'){
                    main.innerHTML = '';
                }
                const start = currentPage * 10;
                const end = Math.min(start + 10, postList.length);
                for (let j = start; j < end; j++) {
                    await displayPosts(j, postList, profileJson, postWrapper, call);
                }
            }
        });
    }
    if (postList.length > 10){
        if (call === 'search'){
            document.body.append(pageNumberContainer)
        }
        if (call === 'dashboard'){
            main.append(pageNumberContainer);
        }
    }
}

export {postRender}