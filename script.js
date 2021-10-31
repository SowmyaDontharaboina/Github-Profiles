

const API_URL = 'https://api.github.com/users/';
const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');

const getUser = async (username) => {
    // axios(API_URL + username)
    // .then((response) => console.log(response.data))
    // .catch((error) => console.log(error));
    try{
        const { data } = await axios(API_URL + username);
        console.log(data)
        createUserCard(data);
        getRepos(username);
    }catch (e) {
        console.log(e)
        if(e.response.status === 404) {
            createErrorCard('No profile found')
        }
    }
}
const createErrorCard = (message) => {
    const cardHtml = `<div class="card">
        <h1>${message}</h1>
    </div>`;
    main.innerHTML = cardHtml;
}
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = search.value;
    if(user && user !== "") {
        getUser(user);
        //search.value = '';
    }
});

const createUserCard = (userdata) => {
    const { avatar_url,name, bio,followers,following, public_repos} = userdata
    const cardHtml = `<div class="card">
        <div>
            <img src="${avatar_url}" alt="" class="avatar">
        </div>
        <div class="user-info">
            <h2>${name}</h2>
            <p>${bio}</p>
            <ul>
                <li>${followers}<strong>Followers</strong></li>
                <li>${following}<strong>Following</strong></li>
                <li>${public_repos}<strong>Repos</strong></li>
            </ul>
            <div id="repos"></div>
        </div>
    </div>`;
    main.innerHTML = cardHtml;
}

const createRepos = (repos) => {
    const repoEl = document.getElementById('repos');
    repos.splice(0,10).forEach((repo) => {
        const repolink = document.createElement('a');
        repolink.classList.add('repo');
        repolink.href = repo.html_url;
        repolink.target = '_blank';
        repolink.innerText = repo.name;
        repoEl.appendChild(repolink);
    })
};

const getRepos = async (username) => {
    try{
        const { data } = await axios(API_URL + username + '/repos?sort=created')
        console.log(data)
        createRepos(data);
    } catch (e) {
        createErrorCard('Problem fetching repos')
    }
}