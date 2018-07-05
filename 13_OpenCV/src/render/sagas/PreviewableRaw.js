/*
import {getPngChunkData, getPngChunkString} from './PreviewableRaw';

let json = JSON.parse(getPngChunkString(evt.target.result, "raWh"))
let dst = getPngChunkData(evt.target.result, "raWd");
*/


export function getPngChunkData(arraybuffer, chunkType){
  return getData(arraybuffer, chunkType)
}
export function getPngChunkString(arraybuffer, chunkType){
  return String.fromCharCode.apply(null, new Uint8Array(getData(arraybuffer, chunkType)));
}

function getUint8(src, begin, end){
    return new Uint8Array(src.slice(begin, end))
}

function convEndian(src){
  return ((
      (src[0] << 24) |
      (src[1] << 16) |
      (src[2] <<  8) |
      (src[3]      )
  ) >>> 0);
}

function getData(arraybuffer, chunkType) {
  let count = 0;

  // シグネチャの確認
  if (String.fromCharCode.apply(null, getUint8(arraybuffer,0, 8)) !== String.fromCharCode(137, 80, 78, 71, 13, 10, 26, 10)) {
      throw new Error('invalid signature');
  }
  count += 8;

  // チャンクの探索
  while (count < arraybuffer.byteLength) {

    let datalength = convEndian( getUint8(arraybuffer, count, count+4) )
    let type = String.fromCharCode.apply(null, getUint8(arraybuffer, count+4, count+4+4));
    //let data = getUint8(arraybuffer, count+8, count+8+datalength)
    //let crc = getUint8(arraybuffer, count+8+datalength, count+8+datalength+4)

    if (chunkType === type)
      return arraybuffer.slice(count + 8, count + 8 + datalength);

    count += (datalength+12);
  }
  return null;
}
