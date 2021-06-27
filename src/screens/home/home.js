import React, { Component } from 'react';
import Header from '../../common/header/header';
import './home.css'
import {
    Avatar,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Container,
    Divider,
    FormControl,
    Grid,
    TextField, Typography
} from '@material-ui/core'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Redirect } from 'react-router-dom';

class Home extends Component {
    constructor() {
        super();
        this.state = {
            searchText: "",
            userImages: [],
            filteredImages: [],
            id: "201548275214708",
            url: "https://instagram.fdel11-2.fna.fbcdn.net/v/t51.2885-19/s320x320/102358546_929842287438655_4513207811348444146_n.jpg?tp=1&_nc_ht=instagram.fdel11-2.fna.fbcdn.net&_nc_ohc=Q6Hnbo3MSYsAX_Xike0&edm=ABfd0MgBAAAA&ccb=7-4&oh=b9bae51076299a1e284e7ecae92e70d8&oe=60DFDB54&_nc_sid=7bff83",
            username: "shedigsinlife",
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true
        }
    }

    async componentDidMount() {
        let getUserImages = this.props.baseUrl + "me/media?fields=id,caption&access_token=" + sessionStorage.getItem("access-token");
        let getPostDetails = this.props.baseUrl + "$postId?fields=id,media_type,media_url,username,timestamp&access_token=" + sessionStorage.getItem("access-token");

        let response = await fetch(getUserImages);
        let posts = await response.json();
        posts = posts.data;

        for (let i = 0; i < posts.length; i++) {
            response = await fetch(getPostDetails.replace('$postId', posts[i].id));
            let details = await response.json();
            posts[i].index = i;
            posts[i].url = details.media_url;
            posts[i].username = details.username;
            posts[i].timestamp = details.timestamp;
            posts[i].comments = []; // For adding new comments.
            posts[i].tags = "#upgrad #upgradproject #reactjs";
            posts[i].likes = Math.round(Math.random() * 100);
            posts[i].isLiked = false; // Setting liked status for the current user.
        }
        this.setState({ userImages: posts });
        this.setState({ filteredImages: posts.filter(x => true) });  // Filtering images for search query.
        console.log(this.state.userImages);
    }


    // On clicking like button. Setting like for the logged in user.
    likeHandler = (details) => {
        let index = details.index;
        let likedImages = this.state.userImages;
        likedImages[index].isLiked = !likedImages[index].isLiked;
        this.setState({ 'userImages': likedImages })
    }

    // On clicking Add button. Adding newly added comment for the corresponding image.
    commentHandler = (details, pos) => {
        let index = details.index;
        var textField = document.getElementById("textfield-" + pos);
        if (textField.value == null || textField.value.trim() === "") {
            return;
        }
        let userImagesTemp = this.state.userImages;
        if (userImagesTemp[index].comments === undefined) {
            userImagesTemp[index].comments = [textField.value];
        } else {
            userImagesTemp[index].comments = userImagesTemp[index].comments.concat([textField.value]);
        }

        textField.value = '';

        this.setState({ 'userImages': userImagesTemp })
    }

    // Filtering the images based on the entered text.
    searchHandler = (e) => {
        if (this.state.searchText == null || this.state.searchText.trim() === "") {
            this.setState({ filteredImages: this.state.userImages });
        } else {
            let filteredForSearch = this.state.userImages.filter((element) => {
                return element.caption !== undefined && (element.caption.toUpperCase().split("\n")[0].indexOf(e.target.value.toUpperCase())) > -1
            });
            this.setState({ filteredImages: filteredForSearch });
        }
    }

    // For syncing a change in state of the entered search text.
    handleChange = (e) => {
        this.setState({ 'searchText': e.target.value }, () => {
            this.searchHandler(e);
        });
    };

    render() {
        // Redirect to login page if not logged in.
        if (this.state.loggedIn === false) return <Redirect to="/" />
        else
            return (
                <div>
                    <div>
                        {/* Invoking Header component with Show Search and Show My Account flags. */}
                        <Header {...this.props} loggedIn={true} dpUrl={this.state.url} showMyAccount={true} showSearch={true} handleChange={this.handleChange} />
                    </div>

                    {/* Posts Master Container. */}
                    <Container className='posts-container'>
                        <Grid container alignContent='center' justify='flex-start' direction='row' spacing={2}>
                            {
                                (this.state.filteredImages || []).map((details, index) => (
                                    <Grid item xs={6} key={details.id + "_img"}>

                                        {/* Card Header, Media and Content. */}
                                        <Card key={details.id}>
                                            <CardHeader
                                                avatar={<Avatar variant="circle" src={this.state.url} className='avatar' />}
                                                title={details.username}
                                                subheader={new Date(details.timestamp).toLocaleString().replace(",", "")} />
                                            <CardMedia style={{ height: 0, paddingTop: '80%', marginBottom: 10 }} image={details.url} />
                                            <Divider variant="middle" />
                                            <CardContent>
                                                <div className='caption'>{details.caption}</div>
                                                <div className='tags'> {details.tags} </div>
                                                <br />
                                                <div className='likes'>
                                                    {
                                                        details.isLiked ?
                                                            <FavoriteIcon fontSize='default' style={{ color: "red" }} onClick={() => this.likeHandler(details)} />
                                                            :
                                                            <FavoriteBorderIcon fontSize='default' onClick={() => this.likeHandler(details)} />
                                                    }
                                                    <Typography>
                                                        <span>&nbsp;{details.isLiked ? (details.likes + 1) + ' likes' : details.likes + ' likes'}</span>
                                                    </Typography>
                                                </div>

                                                {/* Displaying available comments for corresponding image. */}
                                                <div id='comments-container'>
                                                    {
                                                        details.comments ?
                                                            details.comments.map((comment, index) => (
                                                                <p key={index}>
                                                                    <b>{this.state.username}</b> : {comment}
                                                                </p>
                                                            ))
                                                            :
                                                            <p></p>
                                                    }
                                                </div>

                                                {/* Form for adding comments to an image. */}
                                                <div className='post-comment-container'>
                                                    <FormControl className='post-comment-form-control'>
                                                        <TextField id={'textfield-' + index} label="Add a comment" />
                                                    </FormControl>
                                                    <div className='add-button'>
                                                        <FormControl>
                                                            <Button variant='contained' color='primary' onClick={() => this.commentHandler(details, index)}>ADD</Button>
                                                        </FormControl>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Container>
                </div>
            );
    }

}

export default Home;