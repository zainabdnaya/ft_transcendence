import exp from "constants";
import React from "react";
import { useRef, useEffect } from "react";
import { useState } from "react";
import _Canvas from "./page1";
import "antd/dist/antd.css";
import { Card, Avatar, Badge, Result, Row, Col, Space, Modal, List } from "antd";
import { ArrowLeftOutlined, PlayCircleOutlined, ArrowRightOutlined, DislikeOutlined, FlagOutlined, LikeOutlined, FieldNumberOutlined, EnvironmentOutlined, InfoCircleFilled, ArrowUpOutlined, ArrowDownOutlined, HeartOutlined, PauseCircleOutlined } from "@ant-design/icons";
import Canvas from "./Game";
import axios from "axios";
import MatchLive from "./live_match";
import Leaderboard from "./leaderboard";
import { MyProvider, useMyContext } from "./ContextProvider";
const { Meta } = Card;

import { Button, notification, Image, Comment } from 'antd';
import Choose from "./choices";
import moment from "moment";

const contentStyle = {
    height: '30%',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    fontSize: '2em',
    background: 'transparent',
    margin: '5%% auto',
    zIndex: '2',
};

const datas = [
    {
        title: 'Map1',
        render: (res) =>
            <Space>
                <Image src="/default.png" />
            </Space>,

    },
    {
        title: 'Map2',
        render: (res) =>
            <Space>
                <Image src="/map1.png" />
            </Space>,

    },
    {
        title: 'Map3',
        render: (res) =>
            <Space>
                <Image src="map3.png" />
            </Space>,

    },
    {
        title: 'Map4',
        render: (res) =>
            <Space>
                <Image src="map4.png" />
            </Space>,
    },
];



const Next_page = () => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [data, setData] = useState([]);
    const [oneTime, setOneTime] = useState(0);
    const [oneTime1, setOneTime1] = useState(0);
    // const [GameInfo, setGameInfo] = useState([]);
    const [choosable, setChoosable] = useState(false);

    let context: any = useMyContext();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);

    };

    // add event for button
    const handleClick = (e: any) => {
    };


    //create close for component
    const handleClose = (e: any) => {
    };

    const close = (key: string) => {
        axios.get("http://localhost:3000/game/invited/reject/" + localStorage.getItem("id") + "/" + context.ShowCanvas.gameInfo['id']).then(res => {
            notification.close(key);
        });
    };
    // const [ShowCanvas, setShowCanvas] = useState(false);
    const onclick = (key: string) => {
        console.log(context.ShowCanvas.gameInfo);

        axios.get("http://localhost:3000/game/invited/confirm/" + localStorage.getItem("id") + '/' + context.ShowCanvas.gameInfo['id']).then(res => {
            console.log(res.data);
            context.setShowCanvas(
                {
                    gameInfo: res.data,
                    show: true
                }
            )
            notification.close(key);
        });
    };
    const openNotification = (data: any) => {
        const key = `open${Date.now()}`;
        const btn = (
            <div>
                <Button type="primary" size="small" onClick={() => onclick(key)}>
                    Confirm
                </Button>
                <span> </span>
                <Button type="danger" size="small" onClick={() => close(key)}>
                    Reject
                </Button>
            </div>
        );
        notification.open({
            message: ' invited you to play a game',
            description:
                'Do you want to play with ge:',
            btn,
            key,
            style: {
                zIndex: 3,
            },
            duration: 100,
            // onClose: close,
        });
    };
    useEffect(() => {
        const inter = setInterval(() => {
            if (oneTime1 == 0) {

                axios.get("http://localhost:3000/game/is_invited/" + localStorage.getItem("id"))
                    .then(res => {
                        if (res.data['id'] !== undefined) {
                            setOneTime1(1);
                            context.setShowCanvas(
                                {
                                    show: false,
                                    gameInfo: res.data
                                }
                            );
                            console.log('here', context.ShowCanvas.gameInfo);
                            context.ShowCanvas.gameInfo = res.data;
                            openNotification(res.data);
                            clearInterval(inter);
                        }
                    });
            }
            else {
                clearInterval(inter);
            }
        }, 1000);
    }, [context.ShowCanvas.gameInfo]);
    axios.get("http://localhost:3000/user/random")
        .then(res => {
            if (oneTime === 0) {
                setData(res.data);
                setOneTime(1);

            }
        });
    return (
        <div>
            <div className="ant-row">
                <div className="ant-col ant-col-xs-28 ant-col-xl-24" style={{ top: "150px" }}>
                    {!context.ShowCanvas.show &&
                        <Card
                            style={{ padding: "1%", width: "20%", height: "auto", left: "20%", top: "15%", position: "absolute", zIndex: "2", borderRadius: "3%", background: "white" }}
                            cover={

                                <center>
                                    <Badge.Ribbon text="online" style={{ backgroundColor: '#87d068' }} placement='start' />
                                    <Avatar shape="square" size={200} src="https://joeschmoe.io/api/v1/random" />
                                </center>
                            }
                            actions={[<ArrowLeftOutlined key="previous" onClick={() => { setOneTime(0); }
                            } />,
                            <PlayCircleOutlined key="play" onClick={() => {
                                axios.post("http://localhost:3000/game/invite",
                                    {
                                        "username1": localStorage.getItem("usual_full_name"),
                                        "username2": data['name']
                                    })
                                    .then(res => {
                                        // if (oneTime === 0) {
                                        if (res.data.length !== 0) {
                                            setData(res.data);
                                            context.setShowCanvas(
                                                {
                                                    show: true,
                                                    gameInfo: res.data
                                                }
                                            )
                                            setOneTime(1);
                                        }
                                    });
                            }} />,
                            <ArrowRightOutlined key="next" onClick={() => {
                                setOneTime(0);
                            }} />
                            ]}
                        >
                            <Meta
                                title={data['name']}
                                description={
                                    <ul>
                                        <i id="icons">
                                            <li>
                                                <EnvironmentOutlined /> :  {data['country']}
                                            </li>
                                            <li>
                                                <FieldNumberOutlined /> : Level {data['level']}
                                            </li>
                                            <li>
                                                <LikeOutlined /> : wins {data['wins']} Matchs
                                            </li>

                                            <li>
                                                <DislikeOutlined /> : lost {data['loses']} Matchs
                                            </li>
                                            <li>
                                                <FlagOutlined /> : Quit {data['quit']} Match
                                            </li>

                                        </i>


                                    </ul>
                                }
                            />
                        </Card>
                    }
                </div>
                <div className="ant-col ant-col-xs-28 ant-col-xl-24" style={{ top: "150px" }}>
                    {!context.ShowCanvas.show &&
                        <div style={{ position: "absolute", top: "15%", left: "50%", zIndex: "2", width: "40%", height: "auto" }}>
                            <MatchLive />
                        </div>
                    }
                </div>
                <div className="ant-col ant-col-xs-28 ant-col-xl-24" style={{ top: "1000px", width: "100%", left: "25%", zIndex: "2" }} >
                    {!context.ShowCanvas.show &&
                        <div >
                            {/* <Leaderboard /> */}
                        </div>
                    }
                </div>


                {/* {ShowCanvas && <Carousel
                beforeChange={(current) => {
                    if (current === 3) {
                        setShowCanvas(true);
                    }
                }}
                autoplay={false} >
                <div>
                    <h3 style={contentStyle}> Welcome to an online Ping Pong Match   </h3>

                </div>
                <div>
                    <h3 style={contentStyle}>Rules:
                        <li>
                            When the game starts you can  PAUSE  it by clicking the Space key .
                        </li>
                        <li>
                            The game PAUSES 10 seconds if You did not start The Game 10 seconds You Lose.
                        </li>
                        <li>
                            If Quit the Game , we will wait for ypu ti joinn in 10 seconds otherwise You Lose.
                        </li>
                    </h3>
                </div>
                <div>
                    <h3 style={contentStyle}>To Play  You gonna use 2 keys :
                        <li>
                            You Press  < ArrowUpOutlined /> key to Move Up.
                        </li>
                        <li>
                            You Press  <ArrowDownOutlined /> key to Move Up.
                        </li>
                        <li> You Press  The Space Key to PAUSE or TO Continue the Game <PauseCircleOutlined /> </li>
                    </h3>
                </div>
                <div>
                    <h3 style={contentStyle}>Good Luck !<HeartOutlined />  </h3>
                </div>
            </Carousel >} */}
                {
                    //make Canvas in center of the screen
                    <div className="ant-col ant-col-xs-28 ant-col-xl-24" style={{ top: "20%", position: "absolute", zIndex: "2", left: "50%", transform: "translate(-50%,0)" }}>
                        {context.ShowCanvas.show && <Canvas data={context.ShowCanvas['gameInfo']} />}
                    </div>
                }

                {
                    //       <Result style={{ top: "20%", position: "absolute", zIndex: "2", left: "50%", transform: "translate(-50%,0)" }}
                    //       status="success"
                    //       title="Successfully Purchased Cloud Server ECS!"
                    //       subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
                    //       extra={[
                    //           <Button type="primary" key="console">
                    //               Go Console
                    //           </Button>,
                    //           <Button key="buy">Buy Again</Button>,
                    //       ]}
                    //   />
                }
            </div>

            <Row>
                <Col span={1} offset={12} >
                    {!context.ShowCanvas.show && <Button type="primary" style={{ zIndex: "9999", top: "50%", left: "5%" }} onClick={() => {
                        setIsModalVisible(true);
                        // console.log(choosable);
                        // console.log(context.ShowCanvas.show);
                    }}>
                        Random Match
                    </Button>
                    }
                </Col>
            </Row>
            {/* {choosable && !context.ShowCanvas.show && <Choose isModalVisible={true} setIsModalVisible={setChoosable} onClose={() => {
                console.log("close");
            }} />} */}
            {isModalVisible && <Modal title="Choose A Map To Play" visible={true} onOk={handleOk} maskClosable={true} mask={true} onCancel={handleCancel} style={{ top: "10%", width: "100%", height: "100%" }}
                footer={[
                ]}>
                <div style={{ padding: "24px", width: "100%", height: "100%" }}>
                    <Space>
                        <Comment  content={
                            <div style={{ textAlign: "center", fontSize: "25px", fontFamily: "Ro" }} >
                                <h3 >
                                    Rules:
                                </h3>
                                <li>You Press [< ArrowUpOutlined /> or W] key to Move Up  </li>
                                <li>You Press [<ArrowDownOutlined />  or S] key to Move Down </li>
                                <li>You Press [P] key to Pause the Game</li>
                                <li>You can get back to play just click [P] </li>
                                <li>If you Quit the Game , it will Pause </li>
                                <li>Good Luck <HeartOutlined /> </li>
                            </div>
                        }
                        />
                    </Space>
                </div>
                <div>
                    <List
                        grid={{ gutter: 16, column: 4, xs: 1, sm: 2, md: 3, lg: 4, xl: 4 }}
                        dataSource={datas}
                        renderItem={item => (
                            <List.Item>
                                <Card title={
                                    <Space direction="vertical">
                                        {item.title}
                                        <Button type="primary" onClick={() => {
                                            axios.get("http://localhost:3000/game/matchmaking/" + localStorage.getItem("id") + '/' + item.title)
                                                .then(res => {
                                                    if (res.data.length !== 0) {
                                                        context.setShowCanvas(
                                                            {
                                                                show: true,
                                                                gameInfo: res.data
                                                            }
                                                        )
                                                    }
                                                    setIsModalVisible(false);
                                                }
                                                )
                                        }}>
                                            Play
                                        </Button>
                                    </Space>
                                }
                                >
                                    {item.render(item)}
                                </Card>
                            </List.Item>
                        )}
                    />
                </div>
            </Modal>
            }
        </div >
    )
}

export default Next_page;