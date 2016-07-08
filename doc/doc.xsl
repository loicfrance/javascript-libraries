<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:ext="http://exslt.org/common"
  xmlns:str="http://exslt.org/strings">
<xsl:strip-space elements="*"/>

<xsl:include href="templates.xsl" />


<xsl:template name="type-link">
  <xsl:param name="type"/>
  <xsl:param name="class"/>
  <xsl:choose><xsl:when test="$type='this'">
    <a href="#{$class}"><xsl:value-of select="$class" /></a>
  </xsl:when><xsl:when test="$type='void'">void
  </xsl:when><xsl:otherwise>
    <xsl:for-each select="str:split(concat(' ',concat($type, ' ')), '&lt;')">
      <xsl:if test="position()>1">&lt;</xsl:if>
      <xsl:if test="string-length(normalize-space(.))">
        <xsl:for-each select="str:split(concat(' ',concat(., ' ')), '&gt;')">
          <xsl:if test="position()>1">&gt;</xsl:if>
          <xsl:if test="string-length(normalize-space(.))">
            <xsl:for-each select="str:split(concat(' ',concat(., ' ')), ',')">
              <xsl:if test="position()>1">,</xsl:if>
              <xsl:variable name="t" select="normalize-space(.)" />
              <xsl:if test="string-length($t)">
                <a href="#{$t}"><xsl:value-of select="$t" /></a>
              </xsl:if>
            </xsl:for-each>
          </xsl:if>
        </xsl:for-each>
      </xsl:if>
    </xsl:for-each>
  </xsl:otherwise></xsl:choose>
</xsl:template>

<xsl:template name="create-param-table">
  <xsl:param name="context"/>
  <xsl:param name="class"/>
  <table><thead><tr><th colspan="2">Parameters</th></tr></thead>
  <tbody>
    <xsl:for-each select="param">
      <tr id="{$context}_param_{@name}" >
        <td><xsl:value-of select="@name"/></td>
        <td><xsl:call-template name="type-and-description">
          <xsl:with-param name="context" select="$context" />
          <xsl:with-param name="class" select="$class" />
        </xsl:call-template>
        </td>
      </tr>
    </xsl:for-each>
  </tbody></table>
</xsl:template>

<xsl:template name="description">
  <xsl:param name="context" />
  <xsl:param name="class" />
  <xsl:variable name="desc">
    <xsl:choose><xsl:when test="text()!=''">
      <xsl:copy-of select="text()"/>
    </xsl:when><xsl:when test="brief">
      <xsl:copy-of select="brief"/>
    </xsl:when></xsl:choose>
  </xsl:variable>
  <xsl:for-each select="str:split(concat(substring-before(concat($desc, '{@'), '{@'), '\n'), '\n')">
    <xsl:if test="position() &gt; 1"><br/></xsl:if>
    <xsl:value-of select="." />
  </xsl:for-each>
  <xsl:for-each select="str:split(substring-after($desc, '{@'), '{@')">
    <xsl:variable name="text" select="normalize-space(.)" />
    <xsl:variable name="item" select="substring-before($text, '}')" />
    <xsl:variable name="type" select="substring-before($item, ' ')" />
    <xsl:variable name="name" select="substring-after($item, ' ')" />
    <xsl:text> </xsl:text>
    <xsl:choose><xsl:when test="$type='param'">
      <a href="#{$context}_param_{$name}"><xsl:value-of select="$name" /></a>
    </xsl:when><xsl:when test="$type='field'">
      <a href="#{$context}_field_{$name}"><xsl:value-of select="$name" /></a>
    </xsl:when><xsl:otherwise>
      <xsl:element name="{$type}">
        <xsl:for-each select="str:split(concat($name, '\n'), '\n')">
          <xsl:if test="position() &gt; 1"><br/></xsl:if>
          <xsl:value-of select="." />
        </xsl:for-each>
      </xsl:element>
    </xsl:otherwise></xsl:choose>
    <xsl:for-each select="str:split(concat(substring-after($text, '}'), '\n'), '\n')">
      <xsl:if test="position() &gt; 1"><br/></xsl:if>
      <xsl:value-of select="." />
    </xsl:for-each>
  </xsl:for-each>
</xsl:template>

<xsl:template match="/">
<html>
<head>
  <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"/>
  <link href="docStyle.css" rel="stylesheet" />
  <xsl:if test="doc/head"><xsl:copy-of select="doc/head" /></xsl:if>
</head>
<body>
<!--
################################################################################
################################ external links ################################
################################################################################
 -->
<xsl:if test="doc/external-link">
  <p>External links :<br/>
    <xsl:for-each select="doc/external-link">
      <a class="external" target="_blank" href="{@href}" id="{@name}">
        <xsl:value-of select="@name" />
      </a>
    </xsl:for-each>
  </p>
</xsl:if>
<!--
################################################################################
################################### classes ####################################
################################################################################
 -->
<xsl:for-each select="doc/class">
  <xsl:variable name="class" select="@name" />
  <h1 id="{$class}">
    <xsl:value-of select="$class"/>
  </h1>
  <!-- inheritence -->
  <xsl:if test="@extends">
    <p>extends <xsl:value-of select="@extends" /></p>
  </xsl:if>
  <!-- description -->
  <xsl:call-template name="description">
    <xsl:with-param name="context" select="$class" />
    <xsl:with-param name="class" select="$class" />
  </xsl:call-template>
<!--____________________________________________________________________________
################################## constants ###################################
********************************************************************************-->
  <xsl:if test="field[@const='true']">
    <table><thead>
      <tr><th colspan="4">Constants</th></tr>
    </thead><tbody>
      <xsl:for-each select="field[@const='true']">
        <xsl:sort select="@name"/>
        <tr><td>
          <xsl:call-template name="select-visibility">
            <xsl:with-param name="def">public</xsl:with-param>
          </xsl:call-template>
        </td>
          <td><xsl:call-template name="type-link">
            <xsl:with-param name="type" select="@type" />
          </xsl:call-template></td>
          <td><a href="#{$class}_const_{@name}">
            <b><xsl:value-of select="@name" /></b>
          </a></td>
          <td><xsl:copy-of select="brief"/></td>
        </tr>
      </xsl:for-each> <!-- constant -->
    </tbody></table>
    <br/>
  </xsl:if>
<!--____________________________________________________________________________
#################################### fields ####################################
********************************************************************************-->
  <xsl:if test="field[not(@const='true')]">
    <table><thead>
      <tr><th colspan="4">Fields</th></tr>
    </thead><tbody>
      <xsl:for-each select="field[not(@const='true')]">
        <xsl:sort select="@name"/>
        <tr>
          <td><xsl:call-template name="select-visibility" /></td>
          <td><xsl:call-template name="type-link">
            <xsl:with-param name="type" select="@type" />
          </xsl:call-template></td>
          <td><a href="#{$class}_field_{@name}">
            <b><xsl:value-of select="@name" /></b>
          </a></td>
          <td><xsl:copy-of select="brief"/></td>
        </tr>
      </xsl:for-each> <!-- field -->
    </tbody></table>
    <br/>
  </xsl:if>
<!--____________________________________________________________________________
################################# constructors #################################
********************************************************************************-->
  <xsl:if test="constructor">
    <table><thead>
      <tr><th>Constructors</th></tr>
    </thead><tbody>
      <xsl:for-each select="constructor">
        <tr><td><p style="margin:0px; line-height:90%">
          <xsl:call-template name="select-visibility">
            <xsl:with-param name="def">public</xsl:with-param>
          </xsl:call-template>&#160;
          <xsl:if test="@specification"> <!-- abstract, static -->
            <xsl:value-of select="@specification"/>&#160;
          </xsl:if>
            <a href="#{$class}_constructor_{position()}">
              <b><xsl:value-of select="$class"/></b>
            </a>
          ( <xsl:call-template name="show-params" /> )
          <xsl:if test="brief"><br/><span style="margin-left:20pt; font-size:10pt">
            <xsl:copy-of select="brief" /></span>
          </xsl:if>
        </p></td></tr>
      </xsl:for-each> <!-- constructor -->
    </tbody></table>
    <br/>
  </xsl:if>
<!--____________________________________________________________________________
################################## properties ##################################
********************************************************************************-->
  <xsl:if test="property">
    <table><thead>
      <tr><th colspan="5">Properties</th></tr>
    </thead><tbody>
      <xsl:for-each select="property">
        <xsl:sort select="@name"/>
        <tr><td><xsl:call-template name="select-visibility">
            <xsl:with-param name="def">public</xsl:with-param>
          </xsl:call-template>
          <xsl:if test="@specification"> <!-- abstract, static -->
            &#160;<xsl:value-of select="@specification"/>
          </xsl:if></td>
          <td><xsl:call-template name="type-link">
            <xsl:with-param name="type" select="@type" />
          </xsl:call-template></td>
          <td><a href="#{$class}_property_{@name}">
            <b><xsl:value-of select="@name" /></b>
          </a></td>
          <td><xsl:choose>
            <xsl:when test="not(@setter='false') and not(@getter='false')">
              get, set
            </xsl:when><xsl:when test="not(@setter='false')">set
            </xsl:when><xsl:otherwise>get
            </xsl:otherwise></xsl:choose>
          </td>
          <td><xsl:copy-of select="brief"/></td>
        </tr>
      </xsl:for-each> <!-- property -->
    </tbody></table>
    <br/>
  </xsl:if>
<!--____________________________________________________________________________
################################### methods ####################################
********************************************************************************-->
  <xsl:if test="method">
    <table><thead>
      <tr><th colspan="3">Methods</th></tr>
    </thead><tbody>
      <xsl:for-each select="method">
        <xsl:sort select="concat(@specification!='',@name)"/>
        <tr><td>
          <xsl:call-template name="select-visibility">
            <xsl:with-param name="def">public</xsl:with-param>
          </xsl:call-template>
          <xsl:text> </xsl:text>
          <xsl:if test="@specification"> <!-- abstract, static -->
            <xsl:value-of select="@specification"/>&#160;
          </xsl:if>
        </td><td>
          <xsl:call-template name="return-type"><xsl:with-param name="class">
            <xsl:value-of select="$class" /></xsl:with-param>
          </xsl:call-template>
        </td><td><p style="margin:0px; line-height:90%">
          <b><a href="#{$class}_method_{@name}_{position()}">
            <xsl:value-of select="@name"/>
          </a></b>
          ( <xsl:call-template name="show-params" /> )
          <xsl:if test="brief"><br/><span style="margin-left:20pt;font-size:10pt">
            <xsl:copy-of select="brief" /></span>
          </xsl:if>
        </p></td></tr>
      </xsl:for-each> <!-- method -->
    </tbody></table>
    <br/>
  </xsl:if>

<!--@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
===================================== body =====================================
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@-->
<!--____________________________________________________________________________
################################## constants ###################################
********************************************************************************-->
  <xsl:if test="field[@const='true']">
    <h2>Constants</h2>
    <hr class="sections" />
    <xsl:for-each select="field[@const='true']">
      <xsl:sort select="@name"/>
      <xsl:if test="position() &gt; 1">
        <hr/>
      </xsl:if>
      <p id="{$class}_const_{@name}">
        <h3><xsl:value-of select="@name" /></h3><br />
        <span style="font-size: 10pt">
          <xsl:call-template name="select-visibility">
            <xsl:with-param name="def">public</xsl:with-param>
          </xsl:call-template>&#160;
          <xsl:call-template name="type-and-description">
            <xsl:with-param name="context" select="$class" />
            <xsl:with-param name="class" select="$class" />
          </xsl:call-template>
        </span>
      </p>
    </xsl:for-each> <!-- constant -->
    <br/>
  </xsl:if>
<!--____________________________________________________________________________
#################################### fields ####################################
********************************************************************************-->
  <xsl:if test="field[not(@const='true')]">
    <h2>Fields</h2>
    <hr class="sections" />
    <xsl:for-each select="field[not(@const='true')]">
      <xsl:sort select="@name"/>
      <xsl:if test="position() &gt; 1">
        <hr/>
      </xsl:if>
      <xsl:variable name="tag" select="concat(concat($class,'_field_'),@name)"/>
      <p id="{$tag}">
        <h3><xsl:value-of select="@name" /></h3><br />
        <span style="font-size: 10pt">
          <xsl:call-template name="select-visibility" />&#160;
          <xsl:call-template name="type-and-description">
            <xsl:with-param name="context" select="$tag" />
            <xsl:with-param name="class" select="$class" />
          </xsl:call-template>
        </span>
      </p>
    </xsl:for-each> <!-- field -->
    <br/>
  </xsl:if>
<!--____________________________________________________________________________
################################# constructors #################################
********************************************************************************-->
  <xsl:if test="constructor">
    <h2>Constructors</h2>
    <hr class="sections" />
    <xsl:for-each select="constructor">
      <xsl:if test="position() &gt; 1">
        <hr/>
      </xsl:if>
      <xsl:variable name="tag" select="concat(concat($class,'_constructor_'),position())" />
      <p id="{$tag}">
        <xsl:call-template name="select-visibility">
          <xsl:with-param name="def">public</xsl:with-param>
        </xsl:call-template>&#160;
        <b><xsl:value-of select="$class" /></b>
        ( <xsl:call-template name="show-params" /> )
        <br/>
        <span style="font-size: 10pt">
          <xsl:call-template name="description">
            <xsl:with-param name="context" select="$tag" />
            <xsl:with-param name="class" select="$class" />
          </xsl:call-template>
        </span>
        <xsl:if test="param">
          <xsl:call-template name="create-param-table">
            <xsl:with-param name="context" select="$tag" />
            <xsl:with-param name="class" select="$class" />
          </xsl:call-template>
        </xsl:if>
      </p>
    </xsl:for-each> <!-- constructor -->
    <br/>
  </xsl:if>
<!--____________________________________________________________________________
################################## properties ##################################
********************************************************************************-->
  <xsl:if test="property">
    <h2>Properties</h2>
    <hr class="sections" />
    <xsl:for-each select="property">
      <xsl:sort select="@name"/>
      <xsl:if test="position() &gt; 1">
        <hr/>
      </xsl:if>
      <xsl:variable name="tag" select="concat(concat($class,'_property_'),@name)" />
      <p id="{$tag}">
        <h3><xsl:value-of select="@name" /></h3><br/>
        <span style="font-size: 10pt">
          <xsl:call-template name="select-visibility">
            <xsl:with-param name="def">public</xsl:with-param>
          </xsl:call-template>&#160;
          <xsl:if test="@specification"> <!-- abstract, static -->
            <xsl:value-of select="@specification"/>&#160;
          </xsl:if>
          <xsl:if test="@type">
            <xsl:call-template name="type-link">
              <xsl:with-param name="type" select="@type" />
            </xsl:call-template>
          </xsl:if>
          ( <xsl:choose>
            <xsl:when test="not(@setter='false') and not(@getter='false')">
              getter, setter
          </xsl:when><xsl:when test="not(@setter='false')">setter only
          </xsl:when><xsl:otherwise>getter only
          </xsl:otherwise></xsl:choose>)
          <xsl:if test="text()!='' or brief"><br/>
            <xsl:call-template name="description">
              <xsl:with-param name="context" select="$tag" />
              <xsl:with-param name="class" select="$class" />
            </xsl:call-template>
          </xsl:if>
          <xsl:for-each select="get">
            <xsl:if test="position()=1"><br/><b>getter: </b></xsl:if>
            <xsl:call-template name="description">
              <xsl:with-param name="context" select="$tag" />
              <xsl:with-param name="class" select="$class" />
            </xsl:call-template>
          </xsl:for-each>
          <xsl:for-each select="set">
            <xsl:if test="position()=1"><br/><b>setter: </b></xsl:if>
            <xsl:call-template name="description">
              <xsl:with-param name="context" select="$tag" />
              <xsl:with-param name="class" select="$class" />
            </xsl:call-template>
          </xsl:for-each>
        </span>
      </p>
    </xsl:for-each> <!-- property -->
    <br/>
  </xsl:if>
<!--____________________________________________________________________________
################################### methods ####################################
********************************************************************************-->
  <xsl:if test="method">
    <h2>Methods</h2>
    <hr class="sections" />
    <xsl:for-each select="method">
      <xsl:sort select="concat(@specification!='',@name)"/>
      <xsl:if test="position() &gt; 1">
        <hr/>
      </xsl:if>
      <xsl:variable name="tag"
        select="concat(concat($class,'_method_'),concat(@name,concat('_', position())))" />
      <p id="$tag">
        <h3><xsl:value-of select="@name" /></h3><br/>
        <span style="font-size: 10pt">
          <xsl:call-template name="select-visibility">
            <xsl:with-param name="def">public</xsl:with-param>
          </xsl:call-template>&#160;
          <xsl:if test="@specification"> <!-- abstract, static -->
            <xsl:value-of select="@specification"/>&#160;
          </xsl:if>
            <xsl:call-template name="return-type"><xsl:with-param name="class">
              <xsl:value-of select="$class" /></xsl:with-param>
            </xsl:call-template>&#160;
            <b><xsl:value-of select="@name"/></b>
          ( <xsl:call-template name="show-params" /> )
          <br/>
            <xsl:call-template name="description">
              <xsl:with-param name="context" select="$tag" />
              <xsl:with-param name="class" select="$class" />
            </xsl:call-template>
        </span>
        <xsl:if test="param">
          <xsl:call-template name="create-param-table">
            <xsl:with-param name="context" select="$tag" />
            <xsl:with-param name="class" select="$class" />
          </xsl:call-template>
        </xsl:if><xsl:if test="return or (@return != 'void')">
          <table><thead>
            <tr><th colspan="2">Returns</th></tr>
          </thead><tbody>
          <xsl:choose><xsl:when test="@return='this' and not(return)">
            <tr><td><a href="#{@class}">
              <xsl:value-of select="$class" />
            </a></td><td>this</td></tr>
          </xsl:when><xsl:when test="@return and not(return)">
            <tr><td><a href="#{@return}">
              <xsl:value-of select="@return" />
            </a></td><td /></tr>
          </xsl:when><xsl:otherwise>
            <xsl:for-each select="return">
              <tr><td>
                <xsl:if test="@type"><xsl:call-template name="type-link">
                  <xsl:with-param name="type" select="@type" />
                </xsl:call-template></xsl:if>
              </td><td>
                <xsl:call-template name="description">
                  <xsl:with-param name="context" select="$tag" />
                  <xsl:with-param name="class" select="$class" />
                </xsl:call-template>
              </td></tr>
            </xsl:for-each> <!-- return value -->
          </xsl:otherwise></xsl:choose>
        </tbody></table>
        </xsl:if>
      </p>
    </xsl:for-each> <!-- method -->
    <br/>
  </xsl:if>
</xsl:for-each><!-- class -->
</body>
</html>

</xsl:template>
</xsl:stylesheet>
