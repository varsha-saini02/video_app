// UC_x5XG1OV2P6uZZ5FSM9Ttw
import React, { useEffect, useState } from 'react'
import './PlayVideo.css'
import video1 from '../../assets/video.mp4'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import jack from '../../assets/jack.png'
import user_profile from '../../assets/user_profile.jpg'
import { API_KEY, value_converter } from '../../data'
import moment from 'moment'
import { useParams } from 'react-router-dom'


const PlayVideo = () => {
    const {videoId}=useParams();

    const [apiData, setApiData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentData, setCommentData] = useState([])
    const fetchVideoData = async () => {
        const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`
        await fetch(videoDetails_url).then(res => res.json()).then(data => setApiData(data.items[0]))
    }
    const fetchOtherData = async () => {
        if (apiData && apiData.snippet && apiData.snippet.channelId) {

            const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
            await fetch(channelData_url)
                .then(res => res.json())
                .then(data => setChannelData(data.items[0]));
        }
        const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=20&videoId=${videoId}&key=${API_KEY}`
        await fetch(comment_url).then(res => res.json()).then(data => setCommentData(data.items));
    }

    useEffect(() => {
        fetchVideoData()
    }, [videoId])
    useEffect(() => {
        fetchOtherData()
    }, [apiData])

    return (
        <div className='play-video'>
            {/* <video src={video1} controls autoPlay muted></video> */}
            <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            <h3>{apiData ? apiData.snippet.title : "Title Here"}</h3>
            <div className='play-video-info'>
                <p>{apiData ? value_converter(apiData.statistics.viewCount) : "16K"} Views &bull; {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""}</p>
                <div>
                    <span><img src={like} />{apiData ? value_converter(apiData.statistics.likeCount) : "16"}</span>
                    <span><img src={dislike} /></span>
                    <span><img src={share} />Share</span>
                    <span><img src={save} />Save</span>
                </div>
            </div>
            <hr />
            <div className='publisher'>
                <img src={channelData ? channelData.snippet.thumbnails.default.url : ""} />
                <div>
                    <p>{apiData ? apiData.snippet.channelTitle : ""}</p>
                    <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : "0"} Subscribers</span>
                </div>
                <button>Subscribe</button>
            </div>
            <div className='vid-description'>
                <p>{apiData ? apiData.snippet.description.slice(0, 250) : "Description Here"}</p>
                <hr />
                <h4>{apiData ? value_converter(apiData.statistics.commentCount) : "0"}</h4>

                {commentData.map((item, index) => {
                    return (
                        <div key={index}className='comment'>
                            <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} />
                            <div>
                                <h3>{item.snippet.topLevelComment.snippet.authorDisplayName}<span>1 day ago</span></h3>
                                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                                <div className='comment-action'>
                                    <img src={like} />
                                    <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                                    <img src={dislike} />
                                </div>
                            </div>
                        </div>
                    )
                })}

            </div>
        </div>
    )
}

export default PlayVideo
