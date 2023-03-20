import Head from 'next/head'
import {useEffect, useState} from 'react'
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    ConversationHeader
} from '@chatscope/chat-ui-kit-react'
import styles from '@/styles/Home.module.scss'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'

type ChatMessage = {
    messageType: 'USER' | 'GPT'
    message: string
}

export default function Home() {
    const [prompt, setPrompt] = useState('')
    const [chatHistory, setChatHistory] = useState<Array<ChatMessage>>([])

    useEffect(() => {
        const fetchGptAnswer = async () => {
            const response = await fetch('/api/gpt', {
                method: 'POST',
                body: JSON.stringify({prompt: prompt})
            })
            const data = await response.json()
            setChatHistory([...chatHistory, {messageType: 'GPT', message: data.answer}])
        }
        if (chatHistory  && prompt) {
            if (chatHistory.length === 0) {
                console.log('Should not happen')
            } else {
                if (chatHistory.length > 0 && chatHistory.slice(-1)[0].messageType === 'USER') {
                    fetchGptAnswer()
                        .catch(console.error)
                }
            }
        }
    }, [chatHistory])

    useEffect(() => {
        if (prompt) {
            setChatHistory([...chatHistory, {messageType: 'USER', message: prompt}])
        }
    }, [prompt])

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Simple requests to chat GPT"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={styles.main}>
                <div className={styles.description}>

                </div>

                <div className={styles.center}>
                    <MainContainer style={{width: '600px', height: '500px'}}>
                        <ChatContainer>
                            <ConversationHeader>
                                <ConversationHeader.Content userName={'GPT'} info={'Model: text-davinci-003'} />
                            </ConversationHeader>
                            <MessageList>
                                {chatHistory && chatHistory.map((item: ChatMessage, index: number) => {
                                    return (<Message key={`chat-${index}`} model={{message: item.message, direction: item.messageType === 'USER' ? 'outgoing' : 'incoming', position: 'normal'}}/>)
                                })}
                            </MessageList>
                            <MessageInput placeholder="Type message here" onSend={(html, text) => setPrompt(text)} attachButton={false} autoFocus={true}/>
                        </ChatContainer>
                    </MainContainer>
                </div>

                <div className={styles.grid}>

                </div>
            </main>
        </>
    )
}
