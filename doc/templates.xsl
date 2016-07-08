<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:str="http://exslt.org/strings">

  <xsl:template name="string-replace-all">
      <xsl:param name="text" />
      <xsl:param name="replace" />
      <xsl:param name="by" />
      <xsl:choose>
          <xsl:when test="$text = '' or $replace = ''or not($replace)" >
              <xsl:value-of select="$text" />
          </xsl:when>
          <xsl:when test="contains($text, $replace)">
              <xsl:value-of select="substring-before($text,$replace)" />
              <xsl:value-of select="$by" />
              <xsl:call-template name="string-replace-all">
                  <xsl:with-param name="text" select="substring-after($text,$replace)" />
                  <xsl:with-param name="replace" select="$replace" />
                  <xsl:with-param name="by" select="$by" />
              </xsl:call-template>
          </xsl:when>
          <xsl:otherwise>
              <xsl:value-of select="$text" />
          </xsl:otherwise>
      </xsl:choose>
  </xsl:template>

  <xsl:template name="select-default">
    <xsl:param name="value" />
    <xsl:param name="default" />
    <xsl:choose><xsl:when test="$value!=''"><xsl:value-of select="$value"/>
    </xsl:when><xsl:otherwise>
      <xsl:value-of select="$default"/>
    </xsl:otherwise></xsl:choose>
  </xsl:template>

  <xsl:template name="show-params">
    <xsl:for-each select="param">
      <xsl:if test="@optional or @default"> [ </xsl:if>
      <xsl:if test="position() &gt; 1">, </xsl:if>
      <xsl:value-of select="@name"/>
      <xsl:if test="@type">
        : <xsl:call-template name="type-link">
          <xsl:with-param name="type" select="@type" />
        </xsl:call-template>
      </xsl:if>
      <xsl:if test="@default"> = <xsl:value-of select="@default" /></xsl:if>
      <xsl:if test="@optional or @default"> ]</xsl:if>
    </xsl:for-each>
  </xsl:template>

  <xsl:template name="select-visibility">
    <xsl:param name="def" />
    <xsl:call-template name="select-default">
      <xsl:with-param name="value"><xsl:value-of select="@visibility" />
      </xsl:with-param><xsl:with-param name="default">
        <xsl:if test="$def!=''"><xsl:value-of select="$def" /></xsl:if>
        <xsl:if test="not($def)">private</xsl:if>
      </xsl:with-param>
    </xsl:call-template>
  </xsl:template>

  <xsl:template name="return-type">
    <xsl:param name="class" />
    <xsl:choose><xsl:when test="return/@type">
      <xsl:for-each select="return">
        <xsl:if test="position() &gt; 1">, </xsl:if>
        <xsl:call-template name="type-link">
          <xsl:with-param name="type" select="@type" />
          <xsl:with-param name="class" select="$class" />
        </xsl:call-template>
      </xsl:for-each>
    </xsl:when><xsl:when test="@return">
      <xsl:call-template name="type-link">
        <xsl:with-param name="type" select="@return" />
        <xsl:with-param name="class" select="$class" />
      </xsl:call-template>
    </xsl:when><xsl:otherwise>void
    </xsl:otherwise></xsl:choose>
  </xsl:template>

  <xsl:template name="type-and-description">
    <xsl:param name="context"/>
    <xsl:param name="class" />
    <xsl:if test="@type">
      <xsl:call-template name="type-link">
        <xsl:with-param name="type" select="@type" />
      </xsl:call-template>
    </xsl:if>
    <xsl:if test="@optional='true' or @default">
      (optionnal<xsl:if test="@default">.
        default value: <xsl:value-of select="@default" />
      </xsl:if>)
    </xsl:if>
    <xsl:if test="text()!='' or html or brief">
      : <xsl:call-template name="description">
        <xsl:with-param name="context" select="$context" />
          <xsl:with-param name="class" select="$class" />
      </xsl:call-template>
    </xsl:if>
  </xsl:template>

</xsl:stylesheet>
