import asyncio
from itsdangerous import exc
from pandas import concat
import websockets


connections = {}


async def server(ws, path):
    while True:
        add_connection(ws, path)
        try:  # TODO: check if connection closed to exit
            message = await ws.recv()
        except:
            connections[path].remove(ws)
            return
        if len(connections[path]) == 2:
            await send_message(ws, path, message)
        else:
            pass  # TODO: request to change room
            


def add_connection(ws, path):
    if path in connections:
        if not (ws in connections[path]):
            connections[path].append(ws)
    else:
        connections[path] = [ws,]


async def send_message(ws, path, message):
    idx = connections[path].index(ws)
    if idx == 0:
        await connections[path][1].send(message)
    elif idx == 1:
        await connections[path][0].send(message)
    

Server = websockets.serve(server, '127.0.0.1', 1222)

loop = asyncio.get_event_loop()
loop.run_until_complete(Server)
loop.run_forever()