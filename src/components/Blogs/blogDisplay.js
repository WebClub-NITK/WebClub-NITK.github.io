import React, { Component } from 'react'
import "../../styles/blog.css";
import Nav from "../Nav/Nav";
// import axios from 'axios';
import Helmet from "react-helmet";
import BlogApi from "../../_services/blogApi";
// import urlApi from "../../_services/urlApi";
import queryString from 'query-string';
import Loader from "react-loader-spinner";
import { Link, Redirect } from 'react-router-dom'
import {
    FacebookShareButton,
    // LinkedinShareButton,
    // TwitterShareButton,
    WhatsappShareButton
} from "react-share";
import {
    FacebookIcon,
    // LinkedinIcon,
    // TwitterIcon,
    WhatsappIcon
} from "react-share";

class BlogHome extends Component {
    constructor(props) {
        super(props)
        this.htmlContent = React.createRef()
        this.htmlHeading = React.createRef()
        this.htmlSampleText = React.createRef()
        this.editblogdiv = React.createRef()
        this.state = {
            content: '',
            loaderStatus: true,
            blogId: null,
            tagList_: [],
            editBlogStatus: false,
            redirectstatus:false
        }
    }
    async componentDidMount() {

        let blogid = queryString.parse(this.props.location.search).id
        if(blogid===undefined){
            this.setState({redirectstatus:true})
        }
        let res = await BlogApi.loadBlogWithId(blogid)
        console.log(res)
        if (res === 0) {
            this.setState({redirectstatus:true})
        } else {
            this.setState({ blogId: blogid })
            let temp = <div className="container-fluid bg-light pb-5 " style={{ paddingTop: '60px', minHeight: '500px' }}>
                <div style={{ maxWidth: '1000px' }} className="mx-auto">
                    <p className="blog-heading pt-5" ref={this.htmlHeading}></p>
                    <p className="posted-on">Posted on: {res.date} by-<span>{res.writer}</span></p>
                    <p ref={this.htmlSampleText}></p>
                    <p className="blog-content text-justify" ref={this.htmlContent}></p>
                </div>
            </div>
            let tag_list = []
            let counter = 0;
            for (let i = 0; i < res.tag_list.length; i++) {
                tag_list.push(<li className="list-inline-item" key={counter++} style={{ background: 'tomato', padding: '5px 10px', borderRadius: '4px' }} >{res.tag_list[i]}</li>)
            }
            this.setState({
                content: temp,
                loaderStatus: false,
                tagList_: tag_list
            })
            this.htmlContent.current.innerHTML = res.content
            this.htmlHeading.current.innerHTML = res.heading
            this.htmlSampleText.current.innerHTML = res.sample_text
            this.editblogdiv.current.style.display = "block"
            let user_email= await localStorage.getItem('user_email')
            console.log(user_email)
            console.log(res.user_email)
            if(user_email=== res.user_email){
                this.setState({editBlogStatus:true})
            }
        }

    }
    render() {
        let loaderContent = null;
        if (this.state.loaderStatus) {
            loaderContent = <div className="pt-5 text-center mt-5"><Loader type="TailSpin" color="#00BFFF" height={100} width={100} /></div>
        } else {
            loaderContent = null;
        }
        return (
            <>
                {this.state.redirectstatus && <Redirect to={"/pagenotfound"}/>}
                <Helmet>
                    <title>Blog</title>
                </Helmet>
                <Nav sticky="false" transp="false" />
                <div className="position-fixed pl-2" style={{ top: '50%' }}>
                    {/* facebook sharring is giving error  */}
                    <FacebookShareButton url={window.location.href}>
                        <FacebookIcon size={32} round={true}></FacebookIcon>
                    </FacebookShareButton>
                    <br></br>
                    <WhatsappShareButton url={window.location.href} >
                        <WhatsappIcon size={32} round={true}></WhatsappIcon>
                    </WhatsappShareButton>
                </div>
                {loaderContent}
                {this.state.content}
                <div className="bg-light" style={{ display: 'none' }} ref={this.editblogdiv}>
                    <div style={{ maxWidth: '1000px' }} className="mx-auto py-3">
                        <ul className="tags list-inline">
                            {this.state.tagList_}
                        </ul>
                        {this.state.editBlogStatus && <Link to={"/editor/editblog/" + this.state.blogId} className='btn btn-outline-secondary'><i className="fa fa-pencil-square-o" aria-hidden="true"></i>Edit Blog</Link>}
                    </div>
                </div>
            </>
        )
    }
}

export default BlogHome
