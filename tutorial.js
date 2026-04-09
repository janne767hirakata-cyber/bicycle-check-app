// tutorial.js
// AI操作ガイド（Intro.js）のロジック

function startTutorial() {
  // アプリロック画面がアクティブかどうかを優先して判定
  const appLock = document.getElementById('app-lock-screen');
  let steps = [];
  
  if (appLock && appLock.classList.contains('active')) {
    // ロック画面上のガイド
    steps = [
      { intro: "<b>🔒 アプリケーションロック画面</b><br>セキュリティ保護のため、操作がないと自動的にこの画面になります。" },
      { element: document.querySelector('.pin-display'), intro: "ロックを解除するための<b>4桁のPINコード</b>を入力する欄です。", position: 'bottom' },
      { element: document.querySelector('.pin-keypad'), intro: "こちらのテンキーをタップしてPINを入力してください。<br>間違えた場合は右下の「⌫」で消すことができます。", position: 'top' },
      { intro: "正しい4桁のコードを入力すると、自動的に直前の画面に復帰します。" }
    ];
  } else {
    // 現在表示されている通常ページを判定
    const pages = Array.from(document.querySelectorAll('.page'));
    const activePage = pages.find(p => p.style.display !== 'none');
    
    if (!activePage) return;
    
    const pageId = activePage.id;
    
    switch(pageId) {
      case 'page-dashboard':
        steps = getDashboardSteps();
        break;
      case 'page-new-inspection':
        steps = getNewInspectionSteps();
        break;
      case 'page-history':
        steps = getHistorySteps();
        break;
      case 'page-approval':
        steps = getApprovalSteps();
        break;
      case 'page-settings':
        steps = getSettingsSteps();
        break;
      default:
        steps = getDashboardSteps();
    }
  }
  
  if (steps.length === 0) {
    showToast('この画面のガイドはまだありません', 'error');
    return;
  }
  
  const intro = introJs();
  intro.setOptions({
    steps: steps,
    nextLabel: '次へ →',
    prevLabel: '← 戻る',
    doneLabel: '完了',
    skipLabel: '✕',
    showProgress: true,
    exitOnOverlayClick: false, // 枠外タップで閉じないようにする
    disableInteraction: false, // ハイライトされた要素はクリック可能にする
    tooltipClass: 'custom-introjs-tooltip'
  });
  
  intro.start();
}

function getDashboardSteps() {
  return [
    {
      intro: "<b>🤖 ようこそ！自転車点検アプリへ</b><br><br>初めての方へ向けて、基本的な使い方をご案内します。<br>※操作案内は右上の「×」か「スキップ」でいつでも中止できます。"
    },
    {
      element: document.querySelector('.btn-new-inspection'),
      intro: "まずはここから<b>『新規点検』</b>を開始します。<br>タップして点検を始めてみましょう。",
      position: 'bottom'
    },
    {
      element: document.querySelector('.stats-grid'),
      intro: "ここには現在の点検の進捗状況（承認待ちや差し戻しなど）がサマリーとして表示されます。",
      position: 'bottom'
    },
    {
      element: document.querySelector('.vehicle-stats-grid'),
      intro: "各車両のアイコンをタップすると、その車両の履歴に絞り込んで確認できます。",
      position: 'top'
    },
    {
      element: document.querySelector('#nav-history'),
      intro: "下部のメニューから「点検履歴」の確認や、「承認管理」を開くことができます。",
      position: 'top'
    }
  ];
}

function getNewInspectionSteps() {
  const step1 = document.getElementById('form-step-1');
  const step2 = document.getElementById('form-step-2');
  const step3 = document.getElementById('form-step-3');
  const step4 = document.getElementById('form-step-4');

  if (step4 && step4.style.display !== 'none') {
    return [
      { intro: "<b>📝 ステップ4: 完了・送信</b><br>点検の最終確認画面です。" },
      { element: document.querySelector('#completion-summary'), intro: "今回の点検結果のサマリーが表示されます。エラー（赤色）がないか確認してください。", position: "bottom" },
      { element: document.querySelector('.approval-info'), intro: "ここに設定画面で登録した「承認者（助役など）」の情報が表示され、この人に送信されます。", position: "top" },
      { element: document.querySelector('#approval-comment'), intro: "承認者へ伝えたい連絡事項や、特記事項があれば入力します。", position: "top" },
      { element: document.querySelector('.btn-save'), intro: "途中で作業を中断する場合などは「下書き保存」ができます。", position: "top" },
      { element: document.querySelector('#form-step-4 .btn-primary'), intro: "最後に「承認依頼を送信」を押すと点検が完了し、データがクラウドにも連携されます！", position: "top" }
    ];
  } else if (step3 && step3.style.display !== 'none') {
    return [
      { intro: "<b>✔️ ステップ3: 点検実施</b><br>実際の点検項目をひとつずつチェックしていきます。" },
      { element: document.querySelector('#checklist-container'), intro: "チェックリストが表示されます。各項目の「良(緑)」「注意(グレー)」「要修理(赤)」をタップして判定してください。", position: "top" },
      { element: document.querySelector('.checklist-item-comment'), intro: "「注意」や「要修理」にした場合は、こちらの備考欄に詳細（例：右ブレーキ削れ等）をメモしてください。", position: "bottom" },
      { element: document.querySelector('#overall-comment'), intro: "全体を通した総合的な所見があれば、ここにフリーテキストで記入できます。", position: "top" },
      { element: document.querySelector('#form-step-3 .btn-primary'), intro: "全項目のチェックが終わったら、こちらのボタンで最終画面へ進みます。", position: "top" }
    ];
  } else if (step2 && step2.style.display !== 'none') {
    return [
      { intro: "<b>📋 ステップ2: 基本情報入力</b><br>誰が、いつ、どこで点検するかを入力します。" },
      { element: document.querySelector('#inspection-date'), intro: "点検日時です。あらかじめ現在時刻が自動で設定されています。", position: "bottom" },
      { element: document.querySelector('#inspector-name'), intro: "点検する方の名前を入力します（名前は必須入力です）。", position: "bottom" },
      { element: document.querySelector('#vehicle-number-select'), intro: "車両の番号を選択します。リストに見当たらない場合は「直接入力」も選べます。", position: "bottom" },
      { element: document.querySelector('.weather-select'), intro: "現在の天候をタップして直感的に選択できます。", position: "top" },
      { element: document.querySelector('#form-step-2 .btn-primary'), intro: "すべての基本情報を入力したら、「次へ」を押してチェックリストへ進みます。", position: "top" }
    ];
  } else {
    return [
      { intro: "<b>🔍 ステップ1: 車両選択</b><br>新規点検の最初のステップです。" },
      { element: document.querySelector('.step-indicator'), intro: "点検は上部のステップ（１～４）の順に進んでいきます。今は１の段階です。", position: 'bottom' },
      { element: document.querySelector('.vehicle-select-grid'), intro: "まず初めに、これから点検する<b>車の種類（車両）</b>を見つけてタップします。", position: 'top' },
      { element: document.querySelector('#btn-step1-next'), intro: "車両を選択して青枠がついたら、<b>『次へ』</b>ボタンを押して基本情報入力に進んでください。", position: 'top' }
    ];
  }
}

function getHistorySteps() {
  return [
    {
      intro: "<b>📋 点検履歴の画面です</b><br>ここでは過去の記録の確認や、一括操作ができます。"
    },
    {
      element: document.querySelector('.header-actions'),
      intro: "「車両」や「ステータス」で絞り込みができます。<br>例：『下書き』だけを表示するなど。",
      position: 'bottom'
    },
    {
      element: document.querySelector('.select-all-wrapper'),
      intro: "『下書き』の点検を複数選んで、一気に承認依頼を出すことができます。",
      position: 'bottom'
    }
  ];
}

function getApprovalSteps() {
  const pinGate = document.getElementById('approval-pin-gate');
  const isPinGateVisible = pinGate && pinGate.style.display !== 'none';
  
  if (isPinGateVisible) {
    return [
      {
        intro: "<b>🔒 助役ログイン</b><br>管理権限が必要な「承認管理画面」へアクセスするためのログイン画面です。"
      },
      {
        element: document.querySelector('#approval-pin'),
        intro: "この入力欄をタップして、認証のための<b>４桁のPINコード</b>を直接入力してください。<br><br>※初期設定のPINは「1234」です。<br>※セキュリティ保護のため、関係者以外には教えないでください。",
        position: 'bottom'
      },
      {
        element: document.querySelector('.pin-hint'),
        intro: "万が一PINを忘れてしまった場合や、初期PIN（1234）から変更したい場合は、メニューの「設定」画面から再設定が可能です。",
        position: 'top'
      },
      {
        element: document.querySelector('.pin-card .btn-primary'),
        intro: "4桁の数字を入力したら、こちらの「ログイン」ボタンを押して承認管理一覧に進みます。",
        position: 'bottom'
      }
    ];
  } else {
    return [
      {
        intro: "<b>✅ 承認管理一覧</b><br>承認待ちの点検データがここに並びます。"
      },
      {
        element: document.querySelector('#approval-list'),
        intro: "各点検データの内容を確認し、「承認」または問題があれば「差し戻し」を行うことができます。",
        position: 'top'
      }
    ];
  }
}

function getSettingsSteps() {
  const cards = document.querySelectorAll('.settings-card');
  if (!cards || cards.length === 0) {
    return [{ intro: "<b>⚙️ 設定画面です</b><br>アプリの各種設定やカスタマイズが行えます。" }];
  }
  
  return [
    {
      intro: "<b>⚙️ 設定画面の詳細ガイド</b><br>この画面ではアプリに関する全設定が可能です。<br>下にスクロールしながら、各設定項目の役割を隅々までご案内します。"
    },
    {
      element: cards[0],
      intro: "<b>👤 承認者設定</b><br>助役など、承認権限を持つ方の名前やメールアドレス、ログイン用のPINコードを設定します。<br>ここで設定したメール宛に承認や結果の通知が連動します。",
      position: 'top'
    },
    {
      element: cards[1],
      intro: "<b>🔒 セキュリティ設定</b><br>アプリが一定時間放置された際に、不正使用を防ぐため自動でロック画面（暗証番号画面）に戻るまでの時間を決められます。",
      position: 'top'
    },
    {
      element: cards[2],
      intro: "<b>🚲 車両番号管理</b><br>保有している自転車の登録番号を車種ごとに追加・削除します。<br>ここで登録しておくと、点検時に選択リストに表示されるようになり入力が楽になります。",
      position: 'top'
    },
    {
      element: cards[3],
      intro: "<b>💨 推奨空気圧設定</b><br>車種ごとに適切な「タイヤ空気圧」の基準値を入力します。<br>点検員がタイヤをチェックする際、画面に案内として表示され目安になります。",
      position: 'top'
    },
    {
      element: cards[4],
      intro: "<b>📋 カスタム点検項目の追加</b><br>例えば「ライトの点滅機能」など、会社独自の細かいチェックルールがある場合に、基本リストに新しい項目を自由に追加できます。",
      position: 'top'
    },
    {
      element: cards[5],
      intro: "<b>☁️ Power Platform 連携</b><br>SharePointやExcel等のクラウドに点検データを自動で転送・保存するためのWebhook URLをここに設定します。",
      position: 'top'
    },
    {
      element: cards[6] || null,
      intro: "<b>📷 お手本写真の設定</b><br>点検時の参考用として、タイヤやブレーキの「お手本となる状態の写真」を専用にアップロードして登録できます。",
      position: 'top'
    },
    {
      element: cards[cards.length - 1],
      intro: "<b>💾 データ管理</b><br>これまでの点検結果や設定をPCに保存（エクスポート）したり、新しいiPadにデータを移行（インポート）するための重要な機能です。",
      position: 'top'
    }
  ];
}
