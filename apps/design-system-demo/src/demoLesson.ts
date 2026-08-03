import type { Lesson, LessonNode, LessonNodeContent } from '@dotzari/design-system';

const accents = ['#4268ea', '#2f846b', '#d46a45', '#8b5cc7', '#bd8b22', '#16869b'];

function node(
  id: string,
  title: string,
  stepId: string,
  order: number,
  group: number,
  description: string,
  content: LessonNodeContent,
  width?: number,
): LessonNode {
  return { id, title, stepId, order, description, content, width, accent: accents[group], eyebrow: ['입력', '동기 실행', '비동기 위임', '대기열', '재진입', '결과'][group] };
}

const handlerCode = `import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const here = dirname(fileURLToPath(import.meta.url));
const dataDirectory = join(here, 'data');
const userFile = join(dataDirectory, 'users.json');
const port = Number(process.env.PORT || 3000);

const metrics = {
  requests: 0,
  failures: 0,
  startedAt: Date.now(),
};

function sendJson(response, status, value) {
  const body = JSON.stringify(value, null, 2);
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
  });
  response.end(body);
}

function sendError(response, status, message) {
  metrics.failures += 1;
  sendJson(response, status, { error: message, status });
}

async function readRequestBody(request) {
  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;
    if (size > 100_000) {
      throw new Error('요청 본문이 너무 큽니다.');
    }
    chunks.push(chunk);
  }

  if (chunks.length === 0) return {};
  const text = Buffer.concat(chunks).toString('utf8');
  return JSON.parse(text);
}

async function loadUsers() {
  try {
    const text = await readFile(userFile, 'utf8');
    return JSON.parse(text);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function saveUsers(users) {
  await mkdir(dataDirectory, { recursive: true });
  const body = JSON.stringify(users, null, 2);
  await writeFile(userFile, body, 'utf8');
}

async function handleListUsers(response) {
  const users = await loadUsers();
  return sendJson(response, 200, {
    count: users.length,
    items: users,
  });
}

async function handleCreateUser(request, response) {
  const body = await readRequestBody(request);
  const email = String(body.email ?? '').trim();

  if (!email.includes('@')) {
    return sendJson(response, 400, {
      error: '올바른 이메일 주소가 필요합니다.',
    });
  }

  const users = await loadUsers();
  const duplicated = users.some((user) => user.email === email);
  if (duplicated) {
    return sendJson(response, 409, {
      error: '이미 등록된 이메일입니다.',
    });
  }

  const user = {
    id: crypto.randomUUID(),
    email,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await saveUsers(users);
  return sendJson(response, 201, user);
}

async function route(request, response) {
  const url = new URL(request.url ?? '/', 'http://localhost');

  if (request.method === 'GET' && url.pathname === '/health') {
    return sendJson(response, 200, {
      ok: true,
      uptime: Math.round(process.uptime()),
      requests: metrics.requests,
      failures: metrics.failures,
    });
  }

  if (request.method === 'GET' && url.pathname === '/users') {
    return handleListUsers(response);
  }

  if (request.method === 'POST' && url.pathname === '/users') {
    return handleCreateUser(request, response);
  }

  return sendError(response, 404, '요청한 경로를 찾을 수 없습니다.');
}

const server = createServer(async (request, response) => {
  metrics.requests += 1;
  const startedAt = performance.now();

  try {
    await route(request, response);
  } catch (error) {
    console.error(error);
    if (!response.headersSent) {
      sendError(response, 500, '서버에서 요청을 처리하지 못했습니다.');
    } else {
      response.destroy(error);
    }
  } finally {
    const duration = performance.now() - startedAt;
    console.log(JSON.stringify({
      method: request.method,
      url: request.url,
      status: response.statusCode,
      duration: Math.round(duration),
    }));
  }
});

server.listen(port, () => {
  console.log('Server listening on port ' + port);
});

function shutdown(signal) {
  console.log(signal + ' received. Closing server.');
  server.close((error) => {
    if (error) {
      console.error(error);
      process.exitCode = 1;
    }
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
}`;

const handlerLineCount = handlerCode.split('\n').length;

export const demoLesson: Lesson = {
  id: 'node-request-flow',
  title: 'Node.js 요청은 어떻게 완료될까?',
  subject: '소프트웨어 시스템',
  description: '한 요청이 동기 실행과 비동기 작업으로 갈라졌다가 응답으로 합류하는 과정입니다.',
  chapters: [
    { id: 'prepare', title: '입력 · 동기 실행', summary: '실행 재료를 모아 V8과 Call Stack에서 동기 실행을 시작합니다.', stepIds: ['collect', 'execute'], accent: accents[0] },
    { id: 'delegate', title: '비동기 위임 · 대기열', summary: '오래 걸리는 작업을 운영체제에 맡기고 완료 순서를 기다립니다.', stepIds: ['delegate-io', 'wait-io'], accent: accents[2] },
    { id: 'complete', title: '재진입 · 결과', summary: '완료된 callback이 실행 흐름으로 돌아와 응답과 지표를 만듭니다.', stepIds: ['reenter', 'respond', 'overview'], accent: accents[4] },
  ],
  steps: [
    { id: 'collect', chapterId: 'prepare', eyebrow: '1장 · 스텝 1', title: '실행 재료가 파서 앞에 모입니다.', description: '소스, 모듈 의존성, 문법 구조와 환경 설정이 하나의 실행 입력을 만듭니다.' },
    { id: 'execute', chapterId: 'prepare', eyebrow: '1장 · 스텝 2', title: '동기 코드는 Call Stack에서 바로 실행됩니다.', description: 'V8이 만든 명령을 함수 순서대로 실행하고 Promise 후속 작업은 별도 대기열에 둡니다.' },
    { id: 'delegate-io', chapterId: 'delegate', eyebrow: '2장 · 스텝 1', title: '오래 걸리는 작업은 libuv로 넘깁니다.', description: 'Timer, 파일, 네트워크 작업은 JavaScript 실행과 분리되어 운영체제 기능으로 이동합니다.' },
    { id: 'wait-io', chapterId: 'delegate', eyebrow: '2장 · 스텝 2', title: '완료된 작업은 실행 차례를 기다립니다.', description: 'Kernel과 Worker Pool이 만든 결과가 callback과 함께 대기열에 쌓입니다.' },
    { id: 'reenter', chapterId: 'complete', eyebrow: '3장 · 스텝 1', title: 'Event Loop가 다음 callback을 고릅니다.', description: '스택이 빈 순간 우선순위에 따라 대기 중인 callback을 다시 실행 흐름에 올립니다.' },
    { id: 'respond', chapterId: 'complete', eyebrow: '3장 · 스텝 2', title: '응답과 관찰 결과가 함께 만들어집니다.', description: 'Handler가 응답을 조립해 Socket으로 보내고 처리 시간과 오류를 지표로 남깁니다.' },
    { id: 'overview', chapterId: 'complete', eyebrow: '3장 · 스텝 3', title: '전체 요청 경로를 한 번에 살펴봅니다.', description: '24개 요소가 입력, 실행, 위임, 대기, 재진입, 결과의 여섯 역할로 정렬됩니다.' },
  ],
  nodes: [
    node('source', 'JavaScript 소스', 'collect', 0, 0, '함수와 모듈이 실행의 출발점입니다.', { type: 'code', filename: 'server.mjs', language: 'JavaScript', code: handlerCode, sections: [{ id: 'setup', title: '준비와 저장', startLine: 1, endLine: 70, description: '서버 설정과 파일 저장 함수를 준비합니다.' }, { id: 'request', title: '요청 처리', startLine: 71, endLine: 126, description: '입력을 검사하고 경로에 맞는 함수를 실행합니다.' }, { id: 'server', title: '서버와 종료', startLine: 127, endLine: handlerLineCount, description: '오류와 지표를 기록하고 안전하게 종료합니다.' }] }, 430),
    node('loader', '모듈 로더', 'collect', 1, 0, 'import와 require에 적힌 의존성을 찾습니다.', { type: 'routes', items: [{ label: 'ES module', value: 'import' }, { label: 'CommonJS', value: 'require' }] }),
    node('parser', '파서', 'collect', 2, 0, '소스를 문법 구조로 해석합니다.', { type: 'accordion', summary: '해석 결과 보기', body: '문장을 토큰으로 나누고 실행 가능한 구문 트리를 만듭니다.', detail: '문법 오류가 있으면 실행 전에 중단합니다.' }),
    node('config', '환경 설정', 'collect', 3, 0, '실행 인자와 환경 변수를 제공합니다.', { type: 'table', columns: ['이름', '예시'], rows: [['PORT', '3000'], ['NODE_ENV', 'production']] }),
    node('bytecode', 'V8 바이트코드', 'execute', 0, 1, 'Ignition이 실행할 명령으로 변환합니다.', { type: 'summary', body: '자주 실행되는 경로는 이후 최적화 대상이 됩니다.' }),
    node('stack', 'Call Stack', 'execute', 1, 1, '현재 실행 중인 함수 순서를 쌓습니다.', { type: 'visual', label: 'handle → validate → save', description: '가장 위의 함수가 먼저 끝납니다.' }),
    node('microtask', 'Microtask Queue', 'execute', 2, 1, 'Promise 후속 작업이 대기합니다.', { type: 'metric', value: '1순위', label: '현재 작업 직후', body: '일반 callback보다 먼저 확인합니다.' }),
    node('sync-result', '동기 결과', 'execute', 3, 1, '즉시 계산된 값을 다음 함수에 넘깁니다.', { type: 'quote', quote: '기다릴 필요가 없는 결과는 같은 실행 흐름에서 바로 전달됩니다.' }),
    node('timer-api', 'Timer API', 'delegate-io', 0, 2, '지정한 시간이 지난 뒤 신호를 만듭니다.', { type: 'routes', items: [{ label: 'setTimeout', value: '한 번' }, { label: 'setInterval', value: '반복' }] }),
    node('fs-api', 'File System API', 'delegate-io', 1, 2, '파일 읽기와 쓰기를 요청합니다.', { type: 'checklist', items: ['경로 확인', '권한 확인', '작업 위임'] }),
    node('net-api', 'Network API', 'delegate-io', 2, 2, '소켓 연결과 패킷 입출력을 요청합니다.', { type: 'table', columns: ['작업', '신호'], rows: [['연결', 'connect'], ['수신', 'data'], ['종료', 'close']] }),
    node('libuv', 'libuv', 'delegate-io', 3, 2, '운영체제와 작업 스레드에 I/O를 배분합니다.', { type: 'summary', body: '작업 종류에 따라 Kernel 감시와 Worker Pool 실행을 나눕니다.' }),
    node('timer-heap', 'Timer Heap', 'wait-io', 0, 3, '만료 시각 순으로 timer를 관리합니다.', { type: 'metric', value: 'O(log n)', label: '추가·제거 비용' }),
    node('kernel', 'OS Kernel', 'wait-io', 1, 3, '네트워크와 비동기 파일 신호를 처리합니다.', { type: 'visual', label: 'epoll · kqueue · IOCP', description: '운영체제마다 다른 감시 기능을 사용합니다.' }),
    node('worker-pool', 'Worker Pool', 'wait-io', 2, 3, '일부 파일·DNS·암호화 작업을 실행합니다.', { type: 'metric', value: '4', label: '기본 작업 스레드 수' }),
    node('io-ready', '완료된 I/O', 'wait-io', 3, 3, '끝난 작업의 결과와 callback을 묶습니다.', { type: 'accordion', summary: '완료와 실행의 차이', body: 'I/O가 끝나도 callback이 즉시 실행되는 것은 아닙니다.', detail: 'Call Stack이 비고 해당 단계의 차례가 와야 실행됩니다.' }),
    node('nexttick', 'nextTick Queue', 'reenter', 0, 4, '현재 작업 직후 실행할 callback이 모입니다.', { type: 'routes', items: [{ label: '우선순위', value: '높음' }, { label: '주의', value: '과도한 반복' }] }),
    node('callback-q', 'Callback Queue', 'reenter', 1, 4, '완료된 I/O callback이 차례를 기다립니다.', { type: 'checklist', items: ['완료 결과 보관', '등록 순서 유지', '실행 단계 대기'] }),
    node('event-loop', 'Event Loop', 'reenter', 2, 4, '스택과 각 대기열을 확인해 다음 작업을 고릅니다.', { type: 'visual', label: 'timers → poll → check', description: '각 단계에서 실행 가능한 callback을 확인합니다.' }),
    node('handler', '응답 Handler', 'reenter', 3, 4, '준비된 데이터로 응답 내용을 조립합니다.', { type: 'code', filename: 'response.js', language: 'JavaScript', code: "const body = JSON.stringify(result);\nresponse.writeHead(200, { 'content-type': 'application/json' });\nresponse.end(body);" }, 360),
    node('buffer', 'Response Buffer', 'respond', 0, 5, '전송할 header와 body를 모읍니다.', { type: 'table', columns: ['구성', '값'], rows: [['status', '200'], ['content-type', 'application/json']] }),
    node('socket', 'Client Socket', 'respond', 1, 5, '완성된 byte를 클라이언트에 보냅니다.', { type: 'metric', value: '1.8 KB', label: '예시 응답 크기' }),
    node('metrics', '로그와 지표', 'respond', 2, 5, '지연 시간과 오류를 기록합니다.', { type: 'checklist', items: ['처리 시간', '상태 코드', '실패 원인'] }),
    node('client', '브라우저 응답', 'respond', 3, 5, '클라이언트가 결과를 받아 화면을 갱신합니다.', { type: 'quote', quote: '응답이 도착해야 사용자가 보는 상태가 바뀝니다.' }),
  ],
  edges: [
    ['source', 'loader', '의존성 찾기'], ['loader', 'parser', '소스 전달'], ['config', 'loader', '경로 제공'], ['parser', 'bytecode', '변환'],
    ['bytecode', 'stack', '함수 실행'], ['stack', 'sync-result', '즉시 계산'], ['stack', 'microtask', 'Promise 예약'], ['stack', 'timer-api', 'timer 호출'],
    ['stack', 'fs-api', '파일 요청'], ['stack', 'net-api', '네트워크 요청'], ['timer-api', 'libuv', '시간 등록'], ['fs-api', 'libuv', '작업 위임'],
    ['net-api', 'libuv', '감시 등록'], ['libuv', 'timer-heap', '만료 관리'], ['libuv', 'kernel', 'I/O 감시'], ['libuv', 'worker-pool', '작업 배분'],
    ['kernel', 'io-ready', '완료 신호'], ['worker-pool', 'io-ready', '결과 반환'], ['timer-heap', 'callback-q', '만료 callback'], ['io-ready', 'callback-q', 'I/O callback'],
    ['microtask', 'event-loop', '우선 확인'], ['nexttick', 'event-loop', '먼저 확인'], ['callback-q', 'event-loop', '다음 callback'], ['event-loop', 'stack', '스택에 올리기'],
    ['stack', 'handler', '응답 계산'], ['sync-result', 'handler', '값 합류'], ['handler', 'buffer', '직렬화'], ['buffer', 'socket', '전송'],
    ['socket', 'client', '수신'], ['handler', 'metrics', '처리 기록'], ['metrics', 'event-loop', '부하 신호'],
  ].map(([sourceId, targetId, label], index) => ({ id: `edge-${index + 1}`, sourceId, targetId, label })),
};
