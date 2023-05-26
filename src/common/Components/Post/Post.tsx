import React, {useEffect, useState} from "react";
import './post.css';

import {
    getPostsFilter
} from "../../../util/api/postapi.tsx";

import CommentList from "./Comment.tsx";
import PostInteractions from "./PostInteractions.tsx";
import {formatDateAndTime} from "../../../util/postUtils.tsx";
import {Link} from "react-router-dom";


type PostProps = {
    id: number
    username: string,
    title: string,
    body: string,
    lastModifiedDate: string,
    category: Category,
    likes: number,
    bookmarks: number,
    setSlideMessage: React.Dispatch<React.SetStateAction<{ message: string, color: string, messageKey: number, duration?: number } | null>>;
    // The setPostDisplay function prop, to control display of post from the parent component
    setPostDisplay: (value: boolean) => void;
    setCategory: React.Dispatch<React.SetStateAction<string>>;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

type Category = 'invalid' | 'technology' | 'travel' |
    'food' | 'fashion' | 'sports' | 'health' | 'beauty' |
    'music' | 'gaming' | 'finance' | 'education' | 'art' |
    'politics' | 'science' | 'environment' | 'literature' |
    'business' | 'entertainment' | 'history' | 'animals' |
    'miscellaneous' | 'cars' | 'philosophy' | 'photography' |
    'movies' | 'home and garden' | 'career' | 'relationships'
    | 'society' | 'parenting' | 'space' | 'DIY' | 'cooking' |
    'adventure' | 'spirituality' | 'fitness' | 'real estate' |
    'psychology' | 'personal finance' | 'hobbies';

const Post : React.FC<PostProps> = ({ id, username, title,
                                        body, lastModifiedDate, category,
                                        likes, setSlideMessage, setCategory, setSelectedCategory}) => {

    const [interactionsLoading, setInteractionsLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [postDisplay, setPostDisplay] = useState(false);

    useEffect(() => {
        if (!interactionsLoading && !commentsLoading){
            setPostDisplay(true);
        }
    }, [interactionsLoading, commentsLoading]);

    const handleCategoryClick = () => {
        setSelectedCategory(category.replaceAll('-', ' '));
        setCategory(category);
    };

    return (
        <div className={`post ${postDisplay ? ('') : ('hidden')}`}>
            <h2>{title}</h2>
            <p>{body}</p>
                <span onClick={handleCategoryClick} className={`category 
            ${category.toLowerCase().replace(/ /g, '-')}`}>
                #{category}
            </span>
            <div className="post-meta">
                <Link to={`/user/${username}`} className={"author"}>{username}</Link>
                <span className="date">{formatDateAndTime(lastModifiedDate)}</span>
            </div>
            <PostInteractions postId={id} likes={likes} setLoading={setInteractionsLoading}/>
            <CommentList postId={id} setSlideMessage={setSlideMessage} setLoading={setCommentsLoading}/>
        </div>
    );
}

interface PostListProps {
    setSlideMessage: React.Dispatch<React.SetStateAction<{ message: string, color: string, messageKey: number, duration?: number } | null>>;
    page: Array<number>;
    category: string;
    lastDay: number;
    setCategory: React.Dispatch<React.SetStateAction<string>>;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

const PostList : React.FC<PostListProps> = ({ setSlideMessage, page, category, lastDay, setCategory, setSelectedCategory }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<Array<PostProps>>([]); // Specify type
    const [postDisplays, setPostDisplays] = useState<{[id: number] : boolean}>({});
    const [allPostsLoaded, setAllPostsLoaded] = useState(false);
    const [lastFetchPage, setLastFetchPage] = useState( page[page.length - 1]);
    const [init, setInit] = useState(true);

    useEffect(() => {

        if (init) {
            setInit(false);
            return;
        }

        const fetchPosts = async () => {
            const response = await getPostsFilter(category, lastDay, lastFetchPage);
            if (response){
                setPosts(prevState => [...prevState, ...response]);
                setLastFetchPage(lastFetchPage + 1);
            }
            setIsLoading(false);
        }
        fetchPosts();
    }, [page, init]);

    useEffect(() => {

        if (!init){
            setPosts([]);
            const fetchPosts = async () => {
                const response = await getPostsFilter(category, lastDay, 0);
                if (response){
                    setPosts(response);
                    setLastFetchPage(1);
                }
            }
            fetchPosts();
        }

    },[lastDay, category]);

    useEffect(() => {
        if (Object.values(postDisplays).every(value => value)) {
            setAllPostsLoaded(true);
        }
    }, [postDisplays]);

    if (isLoading || !allPostsLoaded) {
        return (
            <div className="loader loading-indicator" id="loader">
                <span className="loader-blink"></span>
            </div>
        );
    }

    return (
        <>
            {posts.map((post, index) => (
                <Post key={index} {...post} setSlideMessage={setSlideMessage} setCategory={setCategory} setSelectedCategory={setSelectedCategory}
                      setPostDisplay={(value) => { // Define a function called setPostDisplay that takes a boolean value as a parameter
                          setPostDisplays(prevState => { // Call setPostDisplays function with a callback function
                              return {...prevState, [post.id]: value}// Update the display setting for the post with post.id
                          });
                      }} />
            ))}
        </>
    );
}

export default PostList;