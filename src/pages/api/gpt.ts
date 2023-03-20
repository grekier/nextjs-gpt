import {NextApiRequest, NextApiResponse} from 'next'
import {Configuration, CreateCompletionResponse, OpenAIApi} from 'openai'
import {AxiosResponse} from 'axios'

const API_KEY = process.env.GPT_API_KEY || ''

const configuration = new Configuration({
    apiKey: API_KEY
})

const length = 10
const openai = new OpenAIApi(configuration)

type Data = {
    answer: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method == 'POST') {
        try {
            if (!req.body) {
                throw Error("Empty body")
            }
            const body = JSON.parse(req.body)
            const prompt = body.prompt as string
            if (!prompt) {
                throw Error("No prompt in request")
            }
            let answer = 'pong'
            if (API_KEY) {
                const response: AxiosResponse<CreateCompletionResponse> = await openai.createCompletion({
                    model: 'text-davinci-003',
                    prompt: prompt,
                    temperature: 0,
                    max_tokens: length
                })
                answer = response.data.choices[0].text || 'No answer available'
            }

            res.status(200).json({answer})
        } catch (e) {
            res.status(400).json({answer: 'Could not parse request'})
        }
    } else {
        res.status(405).json({answer: 'Method not allowed'})
    }
}
