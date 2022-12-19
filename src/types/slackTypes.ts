interface Element {
  type: string; // 'button' etc
  text: {
    type: string; // 'plain_text' etc
    text: string; // 'Click me' etc
  };
  style?: string; // 'primary' etc
  value?: string; // 'click_me_123' etc
  action_id?: string; // 'button' etc
}

interface Block {
  type: string; // 'rich_text'
  block_id: string; // 'csrJz'
  elements: Element[];
}

interface Event {
  client_msg_id: string; // 'd1e9ed0d-a769-4eef-9c37-282a7ec1dd0f'
  type: string; // 'message' | 'app_mention'
  text: string; // 'Hello world'
  user: string; // 'U061F7AUR'
  ts: string; // '1670833732.610129'
  blocks: Block[];
  team: string; // 'T02DG7N3V1B'
  thread_ts?: string; // '1670833626.131449'
  parent_user_id?: string; // 'U02DK80DN9H'
  channel: string; // 'C03N9N729GW'
  event_ts: string; // '1670833732.610129'
}

export type { Element, Block, Event };
