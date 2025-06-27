import { createBot, createProvider, createFlow } from '@builderbot/bot'
import { JsonFileDB as Database } from '@builderbot/database-json'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'

const PORT = process.env.PORT ?? 3008

const main = async () => {
    const adapterFlow = createFlow([])
    
    const adapterProvider = createProvider(Provider)
    
    const adapterDB = new Database({ filename: 'db.json' })

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, media } = req.body;
            await bot.sendMessage(number, message, { media });
            return res.end("send");
        })
    )

    httpServer(+PORT)
}

main()
