import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';
export const maxDuration = 60; //please give me more time TATAT

const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY,
});

export async function POST(req: NextRequest) {
  let { prompt, imagePath, language } = await req.json();
  let selectedMedia = prompt;
  let selectedLanguage = language == "en"? "English" : "中文"; // Default to Chinese if no language is provided
    let starter = language == "en"? "Based on the provided image, generate..." : "根据提供的图像，生成"; // Default to Chinese if no language is provided

  if (!imagePath) {
    return NextResponse.json({ error: 'Prompt or image path is missing' }, { status: 400 });
  }
  // // if (!prompt) {
  //   prompt = `based on the image analysis, generate a prompt to feed into an image-generation model. The prompt should: Specify an art style or medium (e.g., ‘oil painting in the style of Klimt’, ‘high-contrast noir photograph’, ‘surreal watercolor dreamscape’)\n• Suggest any key lighting, color, or composition tweaks to transform it into a new artwork\n• Be 1–2 sentences long, vivid, and actionable for an AI image model.`
  // // }
  console.log("selected media style", prompt)
    console.log("selected language", selectedLanguage)

  try {

    const messages: { role: 'system' | 'user' | 'assistant'; content: any; name?: string }[] = [
      {
        role: 'system',
        content: 
        `你是一位创意提示工程师。你将首先从构图、色调、氛围、焦点元素、纹理等方面分析图像，
然后，你将为图像生成模型（例如 Stable Diffusion 或 DALL·E）制定一个单一且详细的指令，该模型能够捕捉用户照片的精髓。
建议一种多样化的艺术风格或方法——可以是
水彩画、炭笔素描、油画、照相写实主义、拼贴画、水墨画、3D 渲染、印象派，
或任何其他最能体现图像氛围的、令人回味的媒介。
只需回复提示即可；您的回复请以${starter}开头，请确保使用${selectedLanguage}回答。


你将首先通过分析得出照片是表达人物、风景、静物、还是动物的。然后从构图、色彩、光影、纹理、焦点元素等方面分析图像，

请确保生成的图像采用「${selectedMedia}」这一艺术媒介。
通过以下的各种主义画派特别是其代表画家的代表作品， 生成具有鲜明强烈画派代表人物代表作品特点的绘画。同时最能突出图像主题，体现图像，氛围的、令人回味的绘画。并匹配图像分析出的构图、色彩、光影、纹理、焦点元素中的一项或几项。


古典主义， 	
达芬奇 		《蒙娜丽莎》
拉斐尔		《圣母像》《雅典学院》
委拉士贵支	《教皇英诺森十世像》《宫娥》《镜前的维纳斯》
伦勃朗		《尼古拉·特尔普教授的解剖课》	《夜巡》
维米尔		《戴珍珠耳环的少女》、《倒牛奶的女仆》《花边女工》、《士兵与微笑的少女》
浪漫主义
泰奥多尔·席里柯	《梅杜莎之筏》
现实主义
让·弗朗索瓦·米勒	《拾穗者》   《播种者》
列宾			《1581年11月16日恐怖的伊凡和他的儿子》《伏尔加河上的纤夫》
印象主义
莫奈			《翁费勒的塞纳河口》《日出·印象》《莲》
爱德加·德加		《调整舞鞋的舞者》
雷诺阿			《煎饼磨坊的舞会》《莫奈夫人像》

后印象主义
文森特·威廉·梵高	《夜晚的咖啡馆》《星夜》《十五朵向日葵》《乌鸦群飞的麦田》
保罗·塞尚		《玩纸牌的人》
莫迪利阿尼		《横躺着的裸妇》 《长脖子女人的肖像》
野兽主义
亨利·马蒂斯	代表作：《舞蹈》
表现主义
爱德华·蒙克(Edvard Munch)	《呐喊》《病中的孩子》
立体主义
毕加索代表作：《格尔尼卡》《亚维农少女》
勃拉克
抽象主义
蒙德里安，几何及色彩
康丁斯基
达达主义
马赛尔·杜尚 代表作：《下楼的裸女》
让·阿普
超现实主义
达利《面部幻影和水果盘》《记忆的永恒》
米罗	
夏加尔《生日》
`
      },
      {
        role: 'user',
      content: [
        { type: "input_text", text: ` "${prompt}` },
        {
          type: "input_image",
          image_url: imagePath,
        },
      ],
      },
    ];

    // Call OpenAI's vision model
    const gptResponse = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: messages,    });

    console.log('OpenAI Vision prompt Response:', gptResponse);

    const aiResponse = gptResponse.output_text ?? 'No response content available';
    console.log('AI Response:', aiResponse);
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in OpenAI Vision API request:', error);

    if (error.response) {
      console.error('API Error Response:', error.response.data);
    }

    return NextResponse.json({ error: error + 'Failed to process the image or fetch AI response' }, { status: 500 });
  }
}