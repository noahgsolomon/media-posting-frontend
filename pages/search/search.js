import {
    fetchUsers,
    userProfile,
    profileColors
} from '../../util/api/userapi.js'

const jwtToken = localStorage.getItem('jwtToken');
if (!jwtToken){
    localStorage.setItem('destination', '../search/search.html');
    window.location.href = "../login/login.html"
}
window.addEventListener("load", function() {

    const page = document.querySelector('.page');
    page.classList.remove('hidden');

    const searchContent = document.querySelector('.search-content');

    (async () => {
        const allUsers = await fetchUsers();
        await profileColors();
        if (allUsers){
            const usersList = JSON.parse(allUsers);
            const usernameList = usersList.map((user) => user.username);
            for (let i = 0; i < usersList.length; i++) {
                console.log(usernameList[i]);
            }
            const searchBar = document.querySelector(".search-bar");
            searchBar.addEventListener("input", (event) => {
                const searchTerm = event.target.value;

                const allDivs = searchContent.querySelectorAll('div');
                for (const div of allDivs) {
                    searchContent.removeChild(div);
                }

                if (searchTerm.length >= 3){
                    const matchingUsers = usernameList.filter((username) =>
                        username.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    console.log(matchingUsers);

                    for (const user of matchingUsers){
                        const userDiv = document.createElement('div');
                        userDiv.textContent = user;
                        userDiv.classList.add('search-result');
                        searchContent.append(userDiv);

                        userDiv.addEventListener('click', async () => {
                            const postsContainer = document.querySelector('.posts');
                            const allPosts = postsContainer.querySelectorAll('.post');
                            for (const post of allPosts){
                                postsContainer.removeChild(post);
                            }

                            const allDivs = searchContent.querySelectorAll('div');

                            for (const div of allDivs) {
                                searchContent.removeChild(div);
                            }

                            const elementToRemove = document.querySelector('.page-number-container');
                            const messageUser = document.querySelector('.message-user');
                            if (messageUser){
                                messageUser.remove();
                            }
                            const followBtn = document.querySelector('.follow-btn');
                            if (followBtn){
                                followBtn.remove();
                            }

                            document.querySelector('.followers-following').innerHTML = '';

                            if (elementToRemove) {
                                elementToRemove.remove();
                            }

                            await userProfile(user);


                            searchBar.value = '';
                        });
                    }
                }
            });
        }
    })();

});