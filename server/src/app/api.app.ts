import {DbModule} from '../module/db.module';
import {Api} from '../service/api/api';

(async () => {
    const db = new DbModule();
    await db.init();
    const api = new Api(db);

    // const rows = await db.query(`select * from video`);
    // for (let i = 0; i < rows.length; i++) {
    //     const row = rows[i];
    //     const resource = (await db.query(`select * from resource where id=${
    //         row.resourceId
    //     }`))[0];
    //     if (resource && resource.origin === 'youtube') {
    //         await db.query(`update video set ytId=?, thumbnailSrc=? where id=?`, [resource.originId, resource.thumbnailSrc2, row.id]);
    //     }
    //     console.log(i + 1, '/', rows.length);
    // }

    // const rows2 = await db.query(`select * from video where ytId is null`);
    // if (rows2.length > 0) {
    //     await db.query(`delete from video where ${
    //         rows2.map(item => `id=${
    //             item.id
    //         }`).join(' or ')
    //     }`);
    //     await db.query(`delete from video_comment where ${
    //         rows2.map(item => `videoId=${
    //             item.id
    //         }`).join(' or ')
    //     }`);
    // }

    // await db.query(`delete from user where id <= 99`); 
    // await db.query(`delete from video_comment where userId <= 99`); 

    // await db.query(`delete from video_comment where artInfo is not null`);
    // return;



    // 정보삽입
})();
