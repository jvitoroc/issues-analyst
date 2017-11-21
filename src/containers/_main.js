import React from 'react';
import axios from 'axios';
import PropTypes from "prop-types";

import RepositoryList from './RepositoryList';
import SearchBox from '../components/SearchBox';
import Message from "../components/Message";
import Loading from "../components/Loading";
import Header from "../components/Header";

import extractValue from "../utils/extractValue";

class Main extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            repos: null,
            value: '',
            gettingRepos: false,
            justMounted: true
        }

        this.handleChange = this.handleChange.bind(this);
        this.getRepositories = this.getRepositories.bind(this);
    }

    getRepositories(e){ //Get 10 repositories from GitHub
        this.setState({gettingRepos: true, justMounted: false});
        let that = this;
        let url = `https://api.github.com/search/repositories?` +
                    `q=${this.state.value}&` +
                    `per_page=${this.props.repositoryListLength}&` +
                    `client_id=085153c53d393d9f0d9c`

        setTimeout(()=>{
            axios.get(url)
            .then(function (response) {
                if(response.data.total_count && response.data.total_count !== 0)
                    that.repositoriesReceived(response.data);
                else
                    that.repositoriesReceived(false);
            })
            .catch(function (error) {
                    that.repositoriesReceived('error');
            });
        }, 1000);

        e.preventDefault();
    }

    repositoriesReceived(data){
        this.setState({repos:data, gettingRepos: false});
    }

    branchRender(){
        if(this.state.gettingRepos){
            return <Loading />
        }else{
            if(this.state.repos === 'error' || this.state.repos === false){
                return <Message value={"No repositories found!"} />
            }else{
                return <RepositoryList repos={this.state.repos.items} />
            }
        }
    }

    handleChange(e){ //Get the value (name of repository) from the input-text
      this.setState({value: extractValue(e.target.value)});
    }

    render(){
        return(
            <div className="wrap">
                <Header />
                <SearchBox
                getRepositories={this.getRepositories}
                handleChange={this.handleChange} />

                {this.state.justMounted
                    ? <Message value={"Pick a repository!"} />
                    : this.branchRender()
                }
            </div>
        );
    }
}

Main.propTypes = {
    repositoryListLength: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
}

export default Main;
