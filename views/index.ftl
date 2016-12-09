<!DOCTYPE html>
<html>
  <head>
    <title><#if title??>${title}</#if></title>
  </head>
  <body>

    <h1><#if title??>${title}</#if></h1>

    <#if lists??>

<ul>
      <#list lists as x>

        <li>${x.product}  && ${x.OK}</li>

       </#list>
      </#if>
     </ul>
  </body>
</html>