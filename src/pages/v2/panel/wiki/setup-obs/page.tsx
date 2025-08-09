import { Link } from 'wouter'

export default function V2PanelWikiSetupOBS() {
  return (
    <section className="p-8">
      <h4 className="text-2xl font-bold">設置 OBS</h4>
      <ol className="list-decimal pl-6 space-y-4 mt-8">
        <li>新建一個場景，命名為「即時分數」。</li>
        <li>在新建的場景中，新增一個瀏覽器的來源。</li>
        <li>
          <p>瀏覽器的設置如下（沒提及的默認即可）：</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              網址：<strong>{location.origin}/#/obs/scene/master</strong>
            </li>
            <li>
              寬度：<strong>1920</strong>
            </li>
            <li>
              高度：<strong>1080</strong>
            </li>
          </ul>
        </li>
        <li>右鍵點擊來源，點擊 [變換] &gt; [拉伸到營幕大小]</li>
        <li>將剛才新建的場景作為來源，添至東家、南家、西家及北家的場景中。</li>
        <li>
          OBS 設置完成。進一步的操作請見{' '}
          <Link href="~/panel" className="text-primary">
            分數控制台
          </Link>{' '}
          。
        </li>
      </ol>
    </section>
  )
}
