from components import ROOT, P, document
(ROOT/'index.html').write_text(document(), encoding='utf-8')
(ROOT/'robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: '+P['siteUrl']+'/sitemap.xml\n',encoding='utf-8')
(ROOT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>'+P['siteUrl']+'/</loc></url></urlset>\n',encoding='utf-8')
print('Built index.html, robots.txt and sitemap.xml from data/project.json')
