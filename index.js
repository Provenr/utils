var npath = require('path')
var fs = require('fs')
var colors = require('colors')
var _ = require('lodash')

var utils = {
    p: function(path) {
        return npath.resolve(path)
    },

    punix: function(path) {
        return utils.p(path).replace('\/', '/')
    },

    ensurePath: function(path) {
        if (!fs.existsSync(path)) {
            utils.ensurePath(npath.dirname(path))
            fs.mkdirSync(path)
        }
    },

    getBuildTime: function() {
        var now = new Date();
        return '' + now.getFullYear() + (now.getMonth() + 1) + now.getDate() + now.getHours() + now.getMinutes();
    },

    ensureGitignore: function(gitignorePath, rules) {
        gitignorePath = utils.p(gitignorePath)

        if (!fs.existsSync(gitignorePath)) {
            fs.writeFileSync(gitignorePath, '# rules added by enuserGitignore\n' + rules.join('\n'))
        } else {
            var content = fs.readFileSync(gitignorePath).toString()
            var lineHash = {}

            var lines = content.split('\n')
            lines.map(function(line) {
                lineHash[line] = 1
            })

            var ruleAdded = false
            rules.map(function(rule) {
                if (!lineHash[rule]) {
                    if (!ruleAdded) {
                        lines.push('# rules added by enuserGitignore\n')
                    }
                    ruleAdded = true
                    lines.push(rule)
                }
            })

            if (ruleAdded) {
                fs.writeFileSync(gitignorePath, lines.join('\n'))
            }
        }
    },

    /**
     *
     * @param logs: []
     *  $index: string
     *
     *  格式如下
     *
     *  TYPE: message
     *
     *  TYPE 可能是以下的某个值:
     *
     *  error, info, hint, warn
     *
     */
    logs: function(logs) {
        var types = {
            error: function(message) {
                console.error('[ERROR] '.red + message)
            },
            info: function(message) {
                console.info('[INFO] '.green + message)
            },
            hint: function(message) {
                console.info(('[HINT] ' + message).gray)
            },
            warn: function(message) {
                console.warn('[WARNING] '.yellow + message)
            },
            default: function(message) {
                console.log(message)
            }
        }
        if (toString.call(logs) === '[object Array]') {
            logs.map(function(log) {
                if (typeof log == 'string') {
                    var parts = log.split(':')
                    var type = parts[0], message = types[type] ? _.trim(log.replace(parts[0], '')) : log;
                } else {
                    message = log
                }
                var logFunc = types[type] || types['default'];
                logFunc(message)
            })
        }
        else if (toString.call(logs) === '[object String]') {
            types['default'](logs)
        }
    }
}

module.exports = utils
