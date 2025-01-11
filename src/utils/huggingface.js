import { HfInference } from "@huggingface/inference";
const HF_TOKEN = process.env.REACT_APP_HF_TOKEN;

export const genImageHuggingFace = async(prompt) => {
    const inference = new HfInference(HF_TOKEN);
    const blob = await inference.textToImage({
        model: "stabilityai/stable-diffusion-xl-base-1.0",
        inputs: prompt,
    });
    
    return blob;
}
