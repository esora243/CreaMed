// article.js

// グローバル変数としてニュース記事データを定義
let newsArticles = [];
const ADMIN_PASSWORD = "esora243"; // 管理パスワード

// アフィリエイトリンクのリスト
const affiliateLinks = [
    `<a href="https://px.a8.net/svt/ejp?a8mat=45C0QI+4BZMTE+36OM+644DT" rel="nofollow">
<img border="0" width="300" height="250" alt="医師向けキャリア支援サービス" src="https://www29.a8.net/svt/bgt?aid=250823610262&wid=003&eno=01&mid=s00000014863001027000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=45C0QI+4BZMTE+36OM+644DT" alt="">`,
    `<a href="https://px.a8.net/svt/ejp?a8mat=45BQMW+247JR6+4CTU+BWVTE" rel="nofollow">CALORIE TRADE JAPAN - 医療従事者の健康を食事からサポート</a>
<img border="0" width="1" height="1" src="https://www16.a8.net/0.gif?a8mat=45BQMW+247JR6+4CTU+BWVTE" alt="">`,
    `<a href="https://px.a8.net/svt/ejp?a8mat=45BP32+7U7J2A+24CC+TRVYQ" rel="nofollow">40代50代60代の医師転職ドットコム - ベテラン医師のキャリアプランを応援</a>
<img border="0" width="1" height="1" src="https://www16.a8.net/0.gif?a8mat=45BP32+7U7J2A+24CC+TRVYQ" alt="">`,
    `<a href="https://px.a8.net/svt/ejp?a8mat=459ZAU+72TL8I+2YJA+I4FNL" rel="nofollow">
<img border="0" width="350" height="160" alt="マイナビDOCTOR" src="https://www21.a8.net/svt/bgt?aid=250728438428&wid=003&eno=01&mid=s00000013807003044000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=459ZAU+72TL8I+2YJA+I4FNL" alt="">`,
    `<a href="https://px.a8.net/svt/ejp?a8mat=459ZAU+78RXAA+28MI+HWXLE" rel="nofollow">MC-ドクターズネット - 常勤・非常勤問わず全国の医師求人をご紹介</a>
<img border="0" width="1" height="1" src="https://www14.a8.net/0.gif?a8mat=459ZAU+78RXAA+28MI+HWXLE" alt="">`,
    `<a href="https://px.a8.net/svt/ejp?a8mat=459ZAU+6V2YDE+276A+5YJRL" rel="nofollow">
<img border="0" width="100" height="60" alt="民間医局" src="https://www21.a8.net/svt/bgt?aid=250728438415&wid=003&eno=01&mid=s00000010261001001000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=459ZAU+6V2YDE+276A+5YJRL" alt="">`,
    `<a href="https://px.a8.net/svt/ejp?a8mat=459UN5+ANF74Q+4DQM+639IP" rel="nofollow">
<img border="0" width="468" height="60" alt="医師バイトドットコム" src="https://www28.a8.net/svt/bgt?aid=250722401644&wid=002&eno=01&mid=s00000020443001023000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=459UN5+ANF74Q+4DQM+639IP" alt="">`,
    `<a href="https://px.a8.net/svt/ejp?a8mat=459I7N+EWFLLM+5RFS+5ZEMP" rel="nofollow">
<img border="0" width="600" height="500" alt="美容医療の求人" src="https://www21.a8.net/svt/bgt?aid=250706291901&wid=002&eno=01&mid=s00000026884001005000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www13.a8.net/0.gif?a8mat=459I7N+EWFLLM+5RFS+5ZEMP" alt="">`
];

// 記事のタイトルと内容のテンプレート
const articleTemplates = [
    {
        title: "夜勤明けを有効活用！心と体を癒すリフレッシュ術",
        content: "多忙な医療現場で働く皆様、本当にお疲れ様です。不規則な勤務、特に夜勤は心身への負担が大きいもの。今回は、夜勤明けの貴重な時間を心と体を回復させるために有効活用するアイデアをご紹介します。軽い運動や趣味の時間、質の高い睡眠を確保することで、次の勤務への活力を養いましょう。"
    },
    {
        title: "医療従事者のための資産形成入門 - NISAとiDeCoの活用法",
        content: "将来への備えは、日々の業務に集中するための安心材料になります。今回は、多忙な医療従事者の方でも始めやすい資産形成術として、NISAやiDeCoといった制度の基本とメリットを解説します。非課税の恩恵を最大限に活用し、賢く将来設計を始める第一歩を踏み出しましょう。"
    },
    {
        title: "ストレスは溜めずに解消！現場で使えるセルフケア5選",
        content: "命を預かる医療現場では、ストレスはつきものです。しかし、溜め込みすぎは禁物。今回は、勤務の合間や自宅で簡単に実践できるセルフケアの方法を5つご紹介します。深呼吸やマインドフルネス、短いストレッチなどを取り入れて、心身のバランスを整え、日々のパフォーマンスを維持しましょう。"
    },
    {
        title: "医師・看護師必見！今からできる節税対策の基礎知識",
        content: "専門職である医療従事者は、収入に応じた税金の知識も重要です。今回は、医師や看護師の方々が見落としがちな経費の計上や、ふるさと納税、医療費控除の活用法など、基本的な節税対策について解説します。少しの知識で手元に残るお金が変わってきます。賢く制度を利用しましょう。"
    },
    {
        title: "忙しい毎日のための健康時短レシピ - 栄養バランスも考慮",
        content: "不規則な勤務が続くと、食生活も乱れがちです。しかし、健康は資本。今回は、忙しい医療従事者のために、短時間で作れて栄養バランスも良いレシピをご紹介します。作り置きできる常備菜や、調理が簡単なメニューを取り入れて、日々の健康管理に役立ててください。"
    },
    {
        title: "学会参加をキャリアアップに繋げるための3つのポイント",
        content: "学会への参加は、最新知識の習得だけでなく、キャリア形成の絶好の機会です。今回は、参加をより有意義なものにするための3つのポイントを解説します。目的意識を持った情報収集、積極的なネットワーキング、そして学んだことのアウトプットが、あなたの市場価値を高める鍵となります。"
    },
    {
        title: "効果的な時間管理術 - ワークライフバランスの実現",
        content: "日々の業務に追われ、プライベートの時間が確保しづらいと感じていませんか？今回は、ポモドーロテクニックやタスクの優先順位付けなど、医療従事者でも実践しやすい時間管理術を紹介します。仕事の効率を上げ、心にゆとりを持つことで、より充実した毎日を送りましょう。"
    },
    {
        title: "知っておきたい！利用できる公的補助金・助成金ガイド",
        content: "専門的なスキルアップや研究活動には費用がかかるもの。実は、医療従事者が利用できる公的な補助金や助成金制度があることをご存じでしょうか。キャリアアップや研究支援、育児支援など、目的に応じた様々な制度を紹介します。情報収集が、あなたの可能性を広げる第一歩です。"
    },
    {
        title: "同僚との良好な人間関係を築くコミュニケーション術",
        content: "チーム医療の要となるのは、スタッフ間の円滑なコミュニケーションです。今回は、忙しい業務の中でも実践できる、同僚との良好な関係を築くためのヒントをご紹介します。相手の話を傾聴する姿勢や、感謝を伝える習慣が、職場の雰囲気を良くし、チーム全体のパフォーマンス向上に繋がります。"
    },
    {
        title: "最新の医療テクノロジー動向 - AI・遠隔診療の未来",
        content: "医療業界は日々進化しています。AIによる診断支援や遠隔診療の普及など、最新のテクノロジーは私たちの働き方を大きく変える可能性を秘めています。今回は、注目すべき医療テクノロジーの動向とその未来について解説します。変化の波を捉え、自らのキャリアに活かしていきましょう。"
    },
    {
        title: "オフの日に訪れたい、心と体を癒すリトリートスポット",
        content: "日々の緊張から解放される時間は、心身の健康に不可欠です。今回は、医療従事者の皆様におすすめしたい、心静かに過ごせる国内のリトリートスポットをご紹介します。自然豊かな場所でデジタルデトックスをしたり、温泉で疲れを癒したり。次の休日に向けて、リフレッシュプランを立ててみませんか。"
    },
    {
        title: "医療現場のハラスメント対策 - 自分と仲間を守るために",
        content: "残念ながら、医療現場でも様々なハラスメントが発生することがあります。今回は、自分自身や大切な同僚をハラスメントから守るための知識と対処法について解説します。職場の相談窓口や法的な対応について知っておくことは、安心して働き続けるための重要な備えとなります。"
    }
];


// ローカルストレージからニュース記事をロードする関数
function loadNewsArticles() {
    const storedArticles = localStorage.getItem('newsArticles');
    if (storedArticles) {
        newsArticles = JSON.parse(storedArticles);
    } else {
        // ローカルストレージにデータがない場合、記事を生成
        generateArticles();
        saveNewsArticles(); // 生成した記事をローカルストレージに保存
    }
}

// 記事を動的に生成する関数
function generateArticles() {
    const startDate = new Date(2022, 0, 1); // 2022年1月
    const endDate = new Date(2026, 11, 1);   // 2026年12月に変更
    let currentDate = new Date(startDate);
    let articleCounter = 0;

    while (currentDate <= endDate) {
        // 毎月2本の記事を生成
        for (let i = 0; i < 2; i++) {
            const day = (i === 0) ? '10' : '25';
            const dateStr = `${currentDate.getFullYear()}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.${day}`;
            
            const template = articleTemplates[articleCounter % articleTemplates.length];
            
            // ランダムに2つの異なるアフィリエイトリンクを選ぶ
            let adIndex1 = Math.floor(Math.random() * affiliateLinks.length);
            let adIndex2 = Math.floor(Math.random() * affiliateLinks.length);
            while (adIndex1 === adIndex2) {
                adIndex2 = Math.floor(Math.random() * affiliateLinks.length);
            }

            const articleContent = `
                <p class="mb-4">${template.content}</p>
                <div class="my-6 p-4 bg-gray-100 rounded-lg text-center grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div>${affiliateLinks[adIndex1]}</div>
                    <div>${affiliateLinks[adIndex2]}</div>
                </div>
                <p>日々の業務の合間に、ご自身のキャリアやライフプランについて考える時間を持つことも大切です。当クリニックは、皆様の健康とキャリアの両面をサポートしてまいります。</p>
            `;

            newsArticles.push({
                id: `news-${Date.now()}-${articleCounter}`,
                date: dateStr,
                title: `${template.title} (${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月)`,
                content: articleContent
            });
            articleCounter++;
        }
        // 次の月へ
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    // 日付の降順（新しいものが先頭）にソート
    newsArticles.sort((a, b) => new Date(b.date.replace(/\./g, '-')) - new Date(a.date.replace(/\./g, '-')));
}


// ローカルストレージにニュース記事を保存する関数
function saveNewsArticles() {
    localStorage.setItem('newsArticles', JSON.stringify(newsArticles));
}


// お知らせ記事の追加・編集フォーム表示
function showAddArticleForm(article = null) {
    const formContainer = document.getElementById('article-form-container');
    const formTitle = document.getElementById('article-form-title');
    const articleIdInput = document.getElementById('article-id');
    const articleTitleInput = document.getElementById('article-title');
    const articleContentInput = document.getElementById('article-content');

    if (!formContainer) return;

    formContainer.classList.remove('hidden');

    if (article) {
        formTitle.textContent = 'お知らせを編集';
        articleIdInput.value = article.id;
        articleTitleInput.value = article.title;
        
        // HTMLから主要なテキストコンテンツのみを抽出してtextareaに設定
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = article.content;
        const mainText = tempDiv.querySelector('p:first-of-type')?.textContent || '';
        articleContentInput.value = mainText.trim();

    } else {
        formTitle.textContent = '新しいお知らせを追加';
        articleIdInput.value = '';
        articleTitleInput.value = '';
        articleContentInput.value = '';
    }
};

// お知らせ記事のフォーム非表示
function hideArticleForm() {
    const formContainer = document.getElementById('article-form-container');
    if (formContainer) {
        formContainer.classList.add('hidden');
    }
};

// お知らせ記事の保存処理
function handleArticleFormSubmit(e) {
    e.preventDefault();
    const articleId = document.getElementById('article-id').value;
    const title = document.getElementById('article-title').value;
    const contentText = document.getElementById('article-content').value;
    const currentDate = new Date();
    const date = `${currentDate.getFullYear()}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.${currentDate.getDate().toString().padStart(2, '0')}`;

    // 新しい記事にはランダムなアフィリエイトを再度追加
    let adIndex1 = Math.floor(Math.random() * affiliateLinks.length);
    let adIndex2 = Math.floor(Math.random() * affiliateLinks.length);
    while (adIndex1 === adIndex2) {
        adIndex2 = Math.floor(Math.random() * affiliateLinks.length);
    }
    const formattedContent = `
        <p class="mb-4">${contentText.replace(/\n/g, '</p><p class="mb-4">')}</p>
        <div class="my-6 p-4 bg-gray-100 rounded-lg text-center grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>${affiliateLinks[adIndex1]}</div>
            <div>${affiliateLinks[adIndex2]}</div>
        </div>
    `;

    if (articleId) {
        // 編集の場合
        const index = newsArticles.findIndex(a => a.id === articleId);
        if (index !== -1) {
            newsArticles[index].title = title;
            newsArticles[index].content = formattedContent;
            newsArticles[index].date = date; // 編集時も日付を更新
        }
    } else {
        // 新規追加の場合
        const newArticle = {
            id: `news-${Date.now()}`, // 新しいユニークID
            date: date,
            title: title,
            content: formattedContent
        };
        newsArticles.unshift(newArticle); // リストの先頭に追加
    }

    saveNewsArticles();
    hideArticleForm();
    navigate('news-management'); // 管理ページを再ロードしてリストを更新
}

// お知らせ記事の編集 (パスワードチェック付き)
async function checkPasswordAndEditArticle(id) {
    const authenticated = await window.showModal(
        '管理者認証',
        '記事を編集するにはパスワードが必要です。',
        'password'
    );
    if (authenticated) {
        const articleToEdit = newsArticles.find(a => a.id === id);
        if (articleToEdit) {
            navigate('news-management'); // まず管理ページに移動
            setTimeout(() => {
                showAddArticleForm(articleToEdit);
            }, 100); // 少し遅延させてDOMが準備されるのを待つ
        }
    }
};

// お知らせ記事の削除 (パスワードチェック付き)
async function checkPasswordAndDeleteArticle(id) {
    const authenticated = await window.showModal(
        '管理者認証',
        '記事を削除するにはパスワードが必要です。',
        'password'
    );
    if (authenticated) {
        const confirmed = await window.showModal(
            'お知らせ削除の確認',
            'このお知らせを本当に削除しますか？この操作は元に戻せません。',
            'confirm'
        );
        if (confirmed) {
            newsArticles = newsArticles.filter(a => a.id !== id);
            saveNewsArticles();
            navigate('news-management'); // 管理ページを再ロードしてリストを更新
        }
    }
};

